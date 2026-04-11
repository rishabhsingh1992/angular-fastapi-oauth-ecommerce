"""MongoDB document models for orders."""

from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class OrderStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ShippingAddressDocument(BaseModel):
    full_name: str
    address: str
    city: str
    postal_code: str
    country: str


class OrderLineDocument(BaseModel):
    product_id: int
    title: str
    image: str
    price: float
    quantity: int = Field(ge=1)


class OrderDocument(BaseModel):
    """Represents an order document stored in the `orders` collection."""

    id: str = Field(alias="_id")
    user_id: str
    lines: list[OrderLineDocument]
    shipping: ShippingAddressDocument
    status: OrderStatus = OrderStatus.PENDING
    total: float = Field(ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = {"populate_by_name": True}
