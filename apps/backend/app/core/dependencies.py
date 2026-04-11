"""Reusable FastAPI dependency functions."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_token
from app.db.mongo import get_db
from app.models.user import UserDocument

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=True)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db),
) -> UserDocument:
    """
    Validate the bearer JWT and return the corresponding UserDocument.
    Raises 401 if the token is invalid or the user no longer exists.
    """
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exc
    except Exception:
        raise credentials_exc

    user = await db["users"].find_one({"_id": user_id})
    if user is None:
        raise credentials_exc
    return UserDocument(**user)


async def get_current_admin(
    current_user: UserDocument = Depends(get_current_user),
) -> UserDocument:
    """Require the current user to have admin role."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
