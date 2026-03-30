from pydantic import BaseModel, Field


class User(BaseModel):
    id: int
    email: str
    full_name: str | None = None


class Product(BaseModel):
    id: int
    name: str
    price_cents: int = Field(ge=0)
    currency: str = "USD"


class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class Cart(BaseModel):
    id: int
    user_id: int
    items: list[CartItem] = Field(default_factory=list)


class OrderItem(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)
    unit_price_cents: int = Field(ge=0)


class Order(BaseModel):
    id: int
    user_id: int
    items: list[OrderItem] = Field(default_factory=list)
    status: str = "pending"
    total_cents: int = Field(ge=0)
