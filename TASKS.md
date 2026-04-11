# Tasks

---

## Backend

### Project Setup
- [x] Create `apps/backend/main.py` with FastAPI app instance
- [x] Add Pydantic `Settings` class for environment config
- [x] Configure CORS middleware for Angular dev origin (`localhost:4200`)
- [x] `app/core/config.py` — Settings with MongoDB URI, JWT fields, Google OAuth fields
- [x] `app/core/security.py` — JWT create/decode helpers
- [x] `app/core/dependencies.py` — `get_current_user` / `get_current_admin` FastAPI deps
- [x] `app/db/mongo.py` — Motor client, `connect_db` / `close_db` lifespan hooks, `get_db` dep
- [x] `app/main.py` — new app factory wiring up all routers + MongoDB lifespan

### Database
- [x] `app/models/user.py` — `UserDocument` (Mongo document)
- [x] `app/models/cart.py` — `CartDocument`, `CartItemDocument`
- [x] `app/models/order.py` — `OrderDocument`, `OrderLineDocument`, `OrderStatus`
- [ ] Add MongoDB indexes (email unique, orders.user_id, orders.created_at)

### Authentication (OAuth)
- [x] `app/routes/auth.py` — `GET /auth/google` redirect, `GET /auth/callback`, `POST /auth/refresh`, `GET /auth/me`
- [x] `app/services/auth_service.py` — `build_google_auth_url`, `exchange_code_for_user`
- [ ] Move tokens to HttpOnly cookies (currently URL fragment — not prod-safe)
- [ ] Implement token refresh on 401 in Angular interceptor

### Users
- [x] `app/schemas/user.py` — `UserResponse`, `UserUpdateRequest`
- [x] `app/services/user_service.py` — `get_user_by_id`, `update_user`
- [x] `app/routes/users.py` — `GET /users/me`, `PATCH /users/me`

### Products
- [x] `app/schemas/product.py` — `ProductResponse`, `ProductListResponse`, `ProductListParams`
- [x] `app/services/product_service.py` — Fake Store API proxy with search + category filter + pagination
- [x] `app/routes/products.py` — `GET /products`, `GET /products/categories`, `GET /products/{id}`

### Cart
- [x] `app/schemas/cart.py` — `CartResponse`, `AddCartItemRequest`, `UpdateCartItemRequest`
- [x] `app/services/cart_service.py` — `get_cart`, `add_item`, `update_item`, `remove_item`, `clear_cart`
- [x] `app/routes/cart.py` — `GET /cart`, `POST /cart/items`, `PATCH /cart/items/{id}`, `DELETE /cart/items/{id}`, `DELETE /cart`

### Orders
- [x] `app/schemas/order.py` — `OrderResponse`, `CreateOrderRequest`, `UpdateOrderStatusRequest`
- [x] `app/services/order_service.py` — `create_order` (from cart), `list_orders`, `get_order`, `update_order_status`
- [x] `app/routes/orders.py` — `POST /orders`, `GET /orders`, `GET /orders/{id}`, `PATCH /orders/{id}/status`

---

## Frontend

### Project Setup
- [x] Configure `environment.ts` / `environment.prod.ts` with API base URL
- [x] Create `ApiService` with typed `HttpClient` wrapper
- [x] Define shared TypeScript interfaces (`User`, `Product`, `Cart`, `Order`) in `api/api.types.ts`
- [x] Extended product model in `models/product.model.ts` (Fake Store shape + cart/order types)
- [x] Mock data in `mock/mock-data.ts` (10 products, 2 orders, category list)
- [x] Set up lazy-loaded feature routes in `app.routes.ts`
- [ ] Set up global error interceptor
- [ ] Set up auth interceptor to attach JWT to requests

### Authentication
- [x] `services/auth.service.ts` — `loginWithGoogle`, `logout`, `currentUser` signal, `isLoggedIn` computed
- [ ] `AuthGuard` for protected routes (orders, checkout)
- [x] Login page (`features/login/login.ts`) with Google OAuth button
- [ ] OAuth callback handler route (`/auth/callback`)
- [x] User avatar / menu in Navbar showing logged-in state

### Layout & Navigation
- [x] `NavbarComponent` — logo, cart icon with badge, user menu (sign in / avatar + logout)
- [ ] `FooterComponent`
- [x] App shell with `<app-navbar>` + `<router-outlet>`

### Product Catalog
- [x] `HomeComponent` (`features/home`) — grid with search + category filter using mock data
- [x] `ProductCardComponent` (`shared/product-card`) — image, category, title, rating, price, Add to Cart
- [x] `ProductDetailComponent` (`features/product-detail`) — full product page, add to cart with confirmation

### Shopping Cart
- [x] `CartService` — signal-based items, `itemCount`, `total`, `addItem`, `removeItem`, `updateQuantity`, `clear`
- [x] `CartComponent` (`features/cart`) — item list with qty stepper + remove, order summary, checkout CTA
- [ ] Slide-in `CartDrawerComponent` (optional enhancement)

### Checkout
- [x] `CheckoutComponent` — reactive shipping form + order summary + async `placeOrder()`
- [x] Order confirmation state (inline success message with redirect to /orders)
- [ ] Payment form integration

### Orders
- [x] `OrdersComponent` (`features/orders`) — collapsible order list with status badges and line items
- [ ] Dedicated `OrderDetailComponent` route (currently inline in orders list)

### Admin
- [ ] Admin route group with `AdminGuard`
- [ ] `ProductFormComponent` — create / edit product
- [ ] `ProductManagementComponent` — table with edit / delete actions
- [ ] `OrderManagementComponent` — table with status update
