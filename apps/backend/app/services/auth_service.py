"""Google OAuth flow and user upsert logic."""

import httpx

from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token
from app.models.user import UserDocument

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def build_google_auth_url() -> str:
    """Return the Google OAuth authorization URL to redirect the browser to."""
    settings = get_settings()
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"


async def exchange_code_for_user(code: str, db) -> tuple[UserDocument, str, str]:
    """
    Exchange an OAuth code for tokens, fetch user info, upsert the user
    document in MongoDB, and return (user, access_token, refresh_token).
    """
    settings = get_settings()

    # 1. Exchange code for Google tokens
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        token_resp.raise_for_status()
        google_tokens = token_resp.json()

        # 2. Fetch user profile
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_tokens['access_token']}"},
        )
        userinfo_resp.raise_for_status()
        info = userinfo_resp.json()

    # 3. Upsert user in MongoDB
    user_id = f"google:{info['sub']}"
    user_data = {
        "_id": user_id,
        "email": info["email"],
        "name": info.get("name", ""),
        "avatar_url": info.get("picture", ""),
        "provider": "google",
    }
    await db["users"].update_one(
        {"_id": user_id},
        {"$set": user_data, "$setOnInsert": {"is_admin": False}},
        upsert=True,
    )
    doc = await db["users"].find_one({"_id": user_id})
    user = UserDocument(**doc)

    # 4. Issue JWT pair
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    return user, access_token, refresh_token
