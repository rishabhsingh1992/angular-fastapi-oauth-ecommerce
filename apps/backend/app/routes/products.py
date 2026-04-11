"""Product endpoints — read-only proxy over Fake Store API."""

from fastapi import APIRouter, Query

from app.schemas.product import ProductListResponse, ProductResponse
from app.services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    search: str = Query(default=""),
    category: str = Query(default=""),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    from app.schemas.product import ProductListParams
    params = ProductListParams(search=search, category=category, page=page, page_size=page_size)
    return await product_service.get_products(params)


@router.get("/categories", response_model=list[str])
async def list_categories():
    return await product_service.get_categories()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    from fastapi import HTTPException, status
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product
