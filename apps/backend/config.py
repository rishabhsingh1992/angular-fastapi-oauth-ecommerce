from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="development", alias="APP_ENV")
    secret_key: str = Field(default="change-me", alias="SECRET_KEY")

    oauth_client_id: str = Field(default="", alias="OAUTH_CLIENT_ID")
    oauth_client_secret: str = Field(default="", alias="OAUTH_CLIENT_SECRET")
    oauth_google_client_id: str = Field(default="", alias="OAUTH_GOOGLE_CLIENT_ID")
    oauth_google_client_secret: str = Field(default="", alias="OAUTH_GOOGLE_CLIENT_SECRET")

    database_url: str = Field(default="sqlite:///./app.db", alias="DATABASE_URL")


@lru_cache
def get_settings() -> Settings:
    return Settings()
