import logging
from contextlib import asynccontextmanager
from secrets import token_urlsafe
from urllib.parse import urlencode

from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from config import get_settings
from schemas import (
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthTokenResponse,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Product,
    User,
)

logger = logging.getLogger(__name__)

API_PREFIX = "/api/v1"

DEMO_USER = User(
    id=1,
    email="demo@example.com",
    full_name="Demo User",
    first_name="Demo",
    last_name="User",
    phone_number="+1-555-0100",
)
DEMO_PASSWORD = "demo123"

USERS_BY_EMAIL: dict[str, dict[str, str | int]] = {
    DEMO_USER.email: {
        "id": DEMO_USER.id,
        "email": DEMO_USER.email,
        "full_name": DEMO_USER.full_name or "",
        "password": DEMO_PASSWORD,
        "first_name": DEMO_USER.first_name or "",
        "last_name": DEMO_USER.last_name or "",
        "phone_number": DEMO_USER.phone_number or "",
    }
}
TOKENS_TO_EMAIL: dict[str, str] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Starting API in %s mode", settings.app_env)
    yield


def to_user(record: dict[str, str | int]) -> User:
    return User(
        id=int(record["id"]),
        email=str(record["email"]),
        full_name=str(record.get("full_name", "")),
        first_name=str(record.get("first_name", "")),
        last_name=str(record.get("last_name", "")),
        phone_number=str(record.get("phone_number", "")),
    )


def issue_token(email: str) -> str:
    token = token_urlsafe(24)
    TOKENS_TO_EMAIL[token] = email
    return token


def get_user_from_token(token: str) -> User:
    email = TOKENS_TO_EMAIL.get(token)
    if not email or email not in USERS_BY_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid token")
    return to_user(USERS_BY_EMAIL[email])


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

    @api_router.get("/auth/google", tags=["auth"])
    async def auth_google(
        redirect_uri: str = Query(default="http://localhost:4200/auth/callback"),
    ) -> RedirectResponse:
        token = issue_token(DEMO_USER.email)
        query = urlencode(
            {
                "token": token,
                "id": str(DEMO_USER.id),
                "email": DEMO_USER.email,
                "name": DEMO_USER.full_name or "",
                "avatar_url": "https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff",
            }
        )
        return RedirectResponse(url=f"{redirect_uri}?{query}", status_code=307)

    @api_router.post("/auth/register", response_model=AuthTokenResponse, tags=["auth"])
    async def auth_register(payload: AuthRegisterRequest) -> AuthTokenResponse:
        if payload.email in USERS_BY_EMAIL:
            raise HTTPException(status_code=409, detail="Email already registered")

        new_id = max((int(user["id"]) for user in USERS_BY_EMAIL.values()), default=0) + 1
        full_name = payload.full_name or f"{payload.first_name} {payload.last_name}"
        USERS_BY_EMAIL[payload.email] = {
            "id": new_id,
            "email": payload.email,
            "full_name": full_name.strip(),
            "password": payload.password,
            "first_name": payload.first_name,
            "last_name": payload.last_name,
            "phone_number": payload.phone_number,
        }
        token = issue_token(payload.email)
        return AuthTokenResponse(token=token, user=to_user(USERS_BY_EMAIL[payload.email]))

    @api_router.post("/auth/login", response_model=AuthTokenResponse, tags=["auth"])
    async def auth_login(payload: AuthLoginRequest) -> AuthTokenResponse:
        user = USERS_BY_EMAIL.get(payload.email)
        if not user or str(user["password"]) != payload.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = issue_token(payload.email)
        return AuthTokenResponse(token=token, user=to_user(user))

    @api_router.get("/auth/callback", response_model=User, tags=["auth"])
    async def auth_callback(token: str) -> User:
        return get_user_from_token(token)

    @api_router.get("/auth/me", response_model=User, tags=["auth"])
    async def auth_me(token: str) -> User:
        return get_user_from_token(token)

    @api_router.post("/auth/logout", tags=["auth"])
    async def auth_logout(token: str | None = None) -> dict[str, str]:
        if token:
            TOKENS_TO_EMAIL.pop(token, None)
        return {"status": "logged_out"}

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
