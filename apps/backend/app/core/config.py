from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # General
    app_env: str = Field(default="development", alias="APP_ENV")
    secret_key: str = Field(default="change-me-in-production", alias="SECRET_KEY")

    # JWT
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=30, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # Google OAuth
    google_client_id: str = Field(default="", alias="OAUTH_GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(default="", alias="OAUTH_GOOGLE_CLIENT_SECRET")
    google_redirect_uri: str = Field(
        default="http://localhost:8000/api/v1/auth/callback",
        alias="GOOGLE_REDIRECT_URI",
    )

    # MongoDB
    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    mongodb_db_name: str = Field(default="ecommerce", alias="MONGODB_DB_NAME")


@lru_cache
def get_settings() -> Settings:
    return Settings()
