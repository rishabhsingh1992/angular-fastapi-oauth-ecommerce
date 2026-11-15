"""GitHub OAuth endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse

from app.core.config import get_settings
from app.db.mongo import get_db
from app.services.github_auth_service import build_github_auth_url, exchange_code_for_user

router = APIRouter(prefix="/auth/github", tags=["github-auth"])


@router.get("")
async def github_login():
    """Redirect the browser to GitHub's consent screen."""
    return RedirectResponse(build_github_auth_url())


@router.get("/callback")
async def github_callback(code: str, db=Depends(get_db)):
    """Handle the GitHub OAuth callback and redirect to the frontend with tokens."""
    try:
        _, access_token, refresh_token = await exchange_code_for_user(code, db)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub OAuth code exchange failed",
        )

    settings = get_settings()
    frontend_url = (
        f"{settings.frontend_url}/auth/callback#access_token={access_token}"
        f"&refresh_token={refresh_token}"
    )
    return RedirectResponse(frontend_url)
