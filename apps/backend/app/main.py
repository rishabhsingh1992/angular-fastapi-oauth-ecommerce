"""FastAPI application factory for the new app/ package."""

import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.mongo import close_db, connect_db
from app.routes import auth, cart, orders, products, users

logger = logging.getLogger(__name__)

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Starting API in %s mode", settings.app_env)
    await connect_db()
    yield
    await close_db()
    logger.info("API shutdown complete")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="E-Commerce API",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:4200"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_router = APIRouter(prefix=API_PREFIX)

    @api_router.get("/health", tags=["health"])
    async def health_check() -> dict[str, str]:
        return {
            "status": "ok",
            "environment": settings.app_env,
            "service": "backend",
            "version": app.version,
        }

    api_router.include_router(auth.router)
    api_router.include_router(users.router)
    api_router.include_router(products.router)
    api_router.include_router(cart.router)
    api_router.include_router(orders.router)

    app.include_router(api_router)
    return app


app = create_app()
