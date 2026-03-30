import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from schemas import Cart, CartItem, Order, OrderItem, Product, User

logger = logging.getLogger(__name__)

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Starting API in %s mode", settings.app_env)
    yield


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

    @api_router.get("/users/{user_id}", response_model=User, tags=["users"])
    async def get_user(user_id: int) -> User:
        return User(id=user_id, email=f"user{user_id}@example.com", full_name="Demo User")

    @api_router.get("/products/{product_id}", response_model=Product, tags=["products"])
    async def get_product(product_id: int) -> Product:
        return Product(id=product_id, name="Demo Product", price_cents=1999)

    @api_router.get("/carts/{cart_id}", response_model=Cart, tags=["carts"])
    async def get_cart(cart_id: int) -> Cart:
        return Cart(id=cart_id, user_id=1, items=[CartItem(product_id=101, quantity=1)])

    @api_router.get("/orders/{order_id}", response_model=Order, tags=["orders"])
    async def get_order(order_id: int) -> Order:
        return Order(
            id=order_id,
            user_id=1,
            items=[OrderItem(product_id=101, quantity=1, unit_price_cents=1999)],
            status="pending",
            total_cents=1999,
        )

    app.include_router(api_router)

    return app


app = create_app()
