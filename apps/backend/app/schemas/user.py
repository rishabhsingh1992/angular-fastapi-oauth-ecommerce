"""Pydantic request/response schemas for the users domain."""

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatar_url: str
    is_admin: bool


class UserUpdateRequest(BaseModel):
    name: str | None = None
    avatar_url: str | None = None
