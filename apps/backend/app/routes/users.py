"""User profile endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.db.mongo import get_db
from app.models.user import UserDocument
from app.schemas.user import UserResponse, UserUpdateRequest
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: UserDocument = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        is_admin=current_user.is_admin,
    )


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    payload: UserUpdateRequest,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    updated = await user_service.update_user(current_user.id, payload, db)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(
        id=updated.id,
        email=updated.email,
        name=updated.name,
        avatar_url=updated.avatar_url,
        is_admin=updated.is_admin,
    )
