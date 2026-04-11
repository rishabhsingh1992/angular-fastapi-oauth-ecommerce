"""Google OAuth endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.core.security import create_access_token, decode_token
from app.db.mongo import get_db
from app.models.user import UserDocument
from app.schemas.user import UserResponse
from app.services.auth_service import build_google_auth_url, exchange_code_for_user

router = APIRouter(prefix="/auth", tags=["auth"])


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@router.get("/google")
async def google_login():
    """Redirect the browser to Google's consent screen."""
    return RedirectResponse(build_google_auth_url())


@router.get("/callback")
async def google_callback(code: str, db=Depends(get_db)):
    """Handle the OAuth callback, issue JWT tokens, and redirect to the frontend."""
    try:
        _user, access_token, refresh_token = await exchange_code_for_user(code, db)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OAuth code exchange failed",
        )
    # Redirect to Angular with tokens in the URL fragment (replace with HttpOnly cookies in prod)
    frontend_url = f"http://localhost:4200/auth/callback#access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(frontend_url)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Exchange a valid refresh token for a new access token."""
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Not a refresh token")
        user_id: str = payload["sub"]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    new_access = create_access_token(user_id)
    return TokenResponse(access_token=new_access, refresh_token=refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserDocument = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        is_admin=current_user.is_admin,
    )
