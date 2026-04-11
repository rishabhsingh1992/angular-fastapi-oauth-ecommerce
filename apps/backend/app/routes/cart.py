"""Shopping cart endpoints (authenticated)."""

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.db.mongo import get_db
from app.models.user import UserDocument
from app.schemas.cart import AddCartItemRequest, CartResponse, UpdateCartItemRequest
from app.services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await cart_service.get_cart(current_user.id, db)


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
async def add_item(
    payload: AddCartItemRequest,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await cart_service.add_item(current_user.id, payload, db)


@router.patch("/items/{product_id}", response_model=CartResponse)
async def update_item(
    product_id: int,
    payload: UpdateCartItemRequest,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await cart_service.update_item(current_user.id, product_id, payload, db)


@router.delete("/items/{product_id}", response_model=CartResponse)
async def remove_item(
    product_id: int,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await cart_service.remove_item(current_user.id, product_id, db)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    await cart_service.clear_cart(current_user.id, db)
