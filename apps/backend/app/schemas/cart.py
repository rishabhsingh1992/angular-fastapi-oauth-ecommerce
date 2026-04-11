"""Pydantic request/response schemas for the cart domain."""

from pydantic import BaseModel, Field


class CartItemResponse(BaseModel):
    product_id: int
    title: str
    image: str
    price: float
    quantity: int


class CartResponse(BaseModel):
    user_id: str
    items: list[CartItemResponse]
    total: float


class AddCartItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(ge=1)
