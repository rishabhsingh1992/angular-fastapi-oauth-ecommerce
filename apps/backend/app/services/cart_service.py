"""Cart business logic — reads/writes the `carts` collection."""

from fastapi import HTTPException, status

from app.models.cart import CartDocument, CartItemDocument
from app.schemas.cart import AddCartItemRequest, CartResponse, UpdateCartItemRequest
from app.services.product_service import get_product_by_id


def _to_response(cart: CartDocument) -> CartResponse:
    total = sum(i.price * i.quantity for i in cart.items)
    return CartResponse(
        user_id=cart.id,
        items=[i.model_dump() for i in cart.items],
        total=round(total, 2),
    )


async def get_cart(user_id: str, db) -> CartResponse:
    doc = await db["carts"].find_one({"_id": user_id})
    if not doc:
        return CartResponse(user_id=user_id, items=[], total=0.0)
    return _to_response(CartDocument(**doc))


async def add_item(user_id: str, payload: AddCartItemRequest, db) -> CartResponse:
    product = await get_product_by_id(payload.product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    doc = await db["carts"].find_one({"_id": user_id})
    cart = CartDocument(**doc) if doc else CartDocument(**{"_id": user_id, "items": []})

    existing = next((i for i in cart.items if i.product_id == payload.product_id), None)
    if existing:
        existing.quantity += payload.quantity
    else:
        cart.items.append(
            CartItemDocument(
                product_id=product.id,
                title=product.title,
                image=product.image,
                price=product.price,
                quantity=payload.quantity,
            )
        )

    await db["carts"].replace_one(
        {"_id": user_id},
        cart.model_dump(by_alias=True),
        upsert=True,
    )
    return _to_response(cart)


async def update_item(
    user_id: str, product_id: int, payload: UpdateCartItemRequest, db
) -> CartResponse:
    doc = await db["carts"].find_one({"_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")

    cart = CartDocument(**doc)
    item = next((i for i in cart.items if i.product_id == product_id), None)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart")

    item.quantity = payload.quantity
    await db["carts"].replace_one({"_id": user_id}, cart.model_dump(by_alias=True))
    return _to_response(cart)


async def remove_item(user_id: str, product_id: int, db) -> CartResponse:
    doc = await db["carts"].find_one({"_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")

    cart = CartDocument(**doc)
    cart.items = [i for i in cart.items if i.product_id != product_id]
    await db["carts"].replace_one({"_id": user_id}, cart.model_dump(by_alias=True))
    return _to_response(cart)


async def clear_cart(user_id: str, db) -> None:
    await db["carts"].delete_one({"_id": user_id})
