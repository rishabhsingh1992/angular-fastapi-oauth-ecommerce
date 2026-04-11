"""Pydantic schemas for Fake Store API products.

Products are read-only and sourced from fakestoreapi.com — no database writes.
These schemas mirror the Fake Store API response shape.
"""

from pydantic import BaseModel, Field, HttpUrl


class ProductRating(BaseModel):
    rate: float
    count: int


class ProductResponse(BaseModel):
    id: int
    title: str
    price: float
    description: str
    category: str
    image: str
    rating: ProductRating


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int


class ProductListParams(BaseModel):
    """Query parameters for the product list endpoint."""

    search: str = ""
    category: str = ""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
