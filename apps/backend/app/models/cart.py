"""MongoDB document models for the shopping cart."""

from pydantic import BaseModel, Field


class CartItemDocument(BaseModel):
    product_id: int
    title: str
    image: str
    price: float
    quantity: int = Field(ge=1)


class CartDocument(BaseModel):
    """Represents a cart document stored in the `carts` collection.
    One cart per user; upserted on every mutation.
    """

    id: str = Field(alias="_id")  # equals the user _id
    items: list[CartItemDocument] = Field(default_factory=list)

    model_config = {"populate_by_name": True}
