"""Order business logic — reads/writes the `orders` collection."""

import uuid
from datetime import UTC, datetime

from fastapi import HTTPException, status

from app.models.order import OrderDocument, OrderLineDocument, OrderStatus, ShippingAddressDocument
from app.schemas.order import CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest
from app.services import cart_service


def _to_response(order: OrderDocument) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        lines=[line.model_dump() for line in order.lines],
        shipping=order.shipping.model_dump(),
        status=order.status,
        total=order.total,
        created_at=order.created_at,
    )


async def create_order(user_id: str, payload: CreateOrderRequest, db) -> OrderResponse:
    cart = await cart_service.get_cart(user_id, db)
    if not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    lines = [
        OrderLineDocument(
            product_id=item.product_id,
            title=item.title,
            image=item.image,
            price=item.price,
            quantity=item.quantity,
        )
        for item in cart.items
    ]
    order = OrderDocument(
        **{
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "lines": [line.model_dump() for line in lines],
            "shipping": payload.shipping.model_dump(),
            "status": OrderStatus.PENDING,
            "total": round(cart.total, 2),
            "created_at": datetime.now(UTC),
            "updated_at": datetime.now(UTC),
        }
    )
    await db["orders"].insert_one(order.model_dump(by_alias=True))
    await cart_service.clear_cart(user_id, db)
    return _to_response(order)


async def list_orders(user_id: str, db) -> list[OrderResponse]:
    cursor = db["orders"].find({"user_id": user_id}).sort("created_at", -1)
    return [_to_response(OrderDocument(**doc)) async for doc in cursor]


async def get_order(order_id: str, user_id: str, db) -> OrderResponse:
    doc = await db["orders"].find_one({"_id": order_id, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _to_response(OrderDocument(**doc))


async def update_order_status(
    order_id: str, payload: UpdateOrderStatusRequest, db
) -> OrderResponse:
    doc = await db["orders"].find_one({"_id": order_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    await db["orders"].update_one(
        {"_id": order_id},
        {"$set": {"status": payload.status, "updated_at": datetime.now(UTC)}},
    )
    doc = await db["orders"].find_one({"_id": order_id})
    return _to_response(OrderDocument(**doc))
