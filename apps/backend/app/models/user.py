"""MongoDB document model for users."""

from datetime import UTC, datetime

from pydantic import BaseModel, EmailStr, Field


class UserDocument(BaseModel):
    """Represents a user document stored in the `users` collection."""

    id: str = Field(alias="_id")
    email: EmailStr
    name: str
    avatar_url: str = ""
    provider: str = "google"
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = {"populate_by_name": True}
