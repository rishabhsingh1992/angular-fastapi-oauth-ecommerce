"""JWT creation and verification utilities."""

from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt

from app.core.config import get_settings


def _settings():
    return get_settings()


def create_access_token(subject: str) -> str:
    settings = _settings()
    expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str) -> str:
    settings = _settings()
    expire = datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": subject, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT. Raises jose.JWTError on failure.
    Returns the raw payload dict.
    """
    settings = _settings()
    return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
