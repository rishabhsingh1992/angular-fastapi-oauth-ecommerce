"""Order endpoints (authenticated)."""

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_admin, get_current_user
from app.db.mongo import get_db
from app.models.user import UserDocument
from app.schemas.order import CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: CreateOrderRequest,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await order_service.create_order(current_user.id, payload, db)


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await order_service.list_orders(current_user.id, db)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: UserDocument = Depends(get_current_user),
    db=Depends(get_db),
):
    return await order_service.get_order(order_id, current_user.id, db)


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    payload: UpdateOrderStatusRequest,
    _admin: UserDocument = Depends(get_current_admin),
    db=Depends(get_db),
):
    return await order_service.update_order_status(order_id, payload, db)
