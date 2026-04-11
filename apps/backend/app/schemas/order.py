"""Pydantic request/response schemas for the orders domain."""

from datetime import datetime

from pydantic import BaseModel

from app.models.order import OrderStatus


class ShippingAddressRequest(BaseModel):
    full_name: str
    address: str
    city: str
    postal_code: str
    country: str


class OrderLineResponse(BaseModel):
    product_id: int
    title: str
    image: str
    price: float
    quantity: int


class OrderResponse(BaseModel):
    id: str
    user_id: str
    lines: list[OrderLineResponse]
    shipping: ShippingAddressRequest
    status: OrderStatus
    total: float
    created_at: datetime


class CreateOrderRequest(BaseModel):
    """Create an order from the current cart."""

    shipping: ShippingAddressRequest


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus
