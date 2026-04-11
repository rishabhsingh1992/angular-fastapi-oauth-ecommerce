"""CRUD operations for the users collection."""

from app.models.user import UserDocument
from app.schemas.user import UserUpdateRequest


async def get_user_by_id(user_id: str, db) -> UserDocument | None:
    doc = await db["users"].find_one({"_id": user_id})
    return UserDocument(**doc) if doc else None


async def update_user(user_id: str, payload: UserUpdateRequest, db) -> UserDocument | None:
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        return await get_user_by_id(user_id, db)
    await db["users"].update_one({"_id": user_id}, {"$set": updates})
    return await get_user_by_id(user_id, db)
