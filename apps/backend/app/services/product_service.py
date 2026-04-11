"""Product service — proxies the Fake Store API (read-only)."""

from functools import lru_cache

import httpx

from app.schemas.product import ProductListParams, ProductListResponse, ProductResponse

FAKE_STORE_BASE = "https://fakestoreapi.com"


@lru_cache(maxsize=1)
def _cached_products() -> list[dict]:
    """Synchronous bootstrap cache — populated lazily on first async call."""
    return []


async def get_products(params: ProductListParams) -> ProductListResponse:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{FAKE_STORE_BASE}/products")
        resp.raise_for_status()
        all_products: list[dict] = resp.json()

    # Filter
    if params.search:
        q = params.search.lower()
        all_products = [
            p for p in all_products
            if q in p["title"].lower() or q in p.get("description", "").lower()
        ]
    if params.category:
        all_products = [p for p in all_products if p["category"] == params.category]

    total = len(all_products)
    start = (params.page - 1) * params.page_size
    page_items = all_products[start : start + params.page_size]

    return ProductListResponse(
        items=[ProductResponse(**p) for p in page_items],
        total=total,
    )


async def get_product_by_id(product_id: int) -> ProductResponse | None:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{FAKE_STORE_BASE}/products/{product_id}")
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
    return ProductResponse(**resp.json())


async def get_categories() -> list[str]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{FAKE_STORE_BASE}/products/categories")
        resp.raise_for_status()
    return resp.json()
