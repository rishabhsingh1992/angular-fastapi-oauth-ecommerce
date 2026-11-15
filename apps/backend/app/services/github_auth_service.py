"""GitHub OAuth flow and user upsert logic."""

from urllib.parse import urlencode

import httpx

from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token
from app.models.user import UserDocument

GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USERINFO_URL = "https://api.github.com/user"
GITHUB_USER_EMAILS_URL = "https://api.github.com/user/emails"


def build_github_auth_url() -> str:
    """Build the GitHub OAuth authorization URL to redirect the browser to."""
    settings = get_settings()
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": settings.github_redirect_uri,
        "scope": "read:user user:email",
        "allow_signup": "true",
    }
    return f"{GITHUB_AUTHORIZE_URL}?{urlencode(params)}"


async def exchange_code_for_github_token(code: str) -> str:
    """Exchange the GitHub OAuth authorization code for an access token."""
    settings = get_settings()
    data = {
        "client_id": settings.github_client_id,
        "client_secret": settings.github_client_secret,
        "code": code,
        "redirect_uri": settings.github_redirect_uri,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GITHUB_TOKEN_URL,
            data=data,
            headers={"Accept": "application/json"},
        )
        response.raise_for_status()
        payload = response.json()

    access_token = payload.get("access_token")
    if not access_token:
        raise ValueError("GitHub OAuth token exchange did not return an access token")
    return access_token


async def fetch_github_user_info(github_access_token: str) -> dict:
    """Fetch the authenticated user's profile from GitHub API using the access token."""
    headers = {
        "Authorization": f"Bearer {github_access_token}",
        "Accept": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(GITHUB_USERINFO_URL, headers=headers)
        response.raise_for_status()
        return response.json()


async def fetch_github_user_email(github_access_token: str) -> str:
    """Fetch the user's primary verified email from GitHub API."""
    headers = {
        "Authorization": f"Bearer {github_access_token}",
        "Accept": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(GITHUB_USER_EMAILS_URL, headers=headers)
        response.raise_for_status()
        emails = response.json()

    for item in emails:
        if item.get("primary") and item.get("verified"):
            return item.get("email")

    for item in emails:
        if item.get("email"):
            return item["email"]

    return ""


async def upsert_github_user(user_info: dict, db) -> UserDocument:
    """Find or create the user in MongoDB using the GitHub profile details."""
    github_id = str(user_info["id"])
    email = user_info.get("email") or f"github-{github_id}@users.noreply.github.com"
    user_id = f"github:{github_id}"
    user_data = {
        "_id": user_id,
        "email": email,
        "name": user_info.get("name") or user_info.get("login") or "GitHub User",
        "avatar_url": user_info.get("avatar_url", ""),
        "provider": "github",
    }

    await db["users"].update_one(
        {"_id": user_id},
        {"$set": user_data, "$setOnInsert": {"is_admin": False}},
        upsert=True,
    )
    doc = await db["users"].find_one({"_id": user_id})
    return UserDocument(**doc)


async def exchange_code_for_user(code: str, db) -> tuple[UserDocument, str, str]:
    """Orchestrate the full GitHub OAuth flow and return JWTs for the user."""
    github_access_token = await exchange_code_for_github_token(code)
    user_info = await fetch_github_user_info(github_access_token)

    if not user_info.get("email"):
        user_info["email"] = await fetch_github_user_email(github_access_token)

    user = await upsert_github_user(user_info, db)
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return user, access_token, refresh_token
