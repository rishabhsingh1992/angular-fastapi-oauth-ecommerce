"""Motor (async MongoDB) client and FastAPI dependency."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING

from app.core.config import get_settings

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Open the Motor connection pool. Call from app lifespan startup."""
    global _client
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    
    db = _client[settings.mongodb_db_name]
    
    # Create indexes idempotently
    # Unique email index on users collection
    await db.users.create_index("email", unique=True, sparse=True)
    
    # Index on orders.user_id for filtering user orders
    await db.orders.create_index("user_id", sparse=True)
    
    # Descending index on orders.created_at for sorting recent orders first
    await db.orders.create_index([("created_at", DESCENDING)], sparse=True)


async def close_db() -> None:
    """Close the Motor connection pool. Call from app lifespan shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("MongoDB client is not initialised. Call connect_db() first.")
    return _client


async def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency — yields the active database handle."""
    settings = get_settings()
    yield get_client()[settings.mongodb_db_name]
