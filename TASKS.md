# Tasks

---

## Backend

### Project Setup
- [ ] Create `apps/backend/main.py` with FastAPI app instance
- [ ] Add Pydantic `Settings` class for environment config
- [ ] Configure CORS middleware for Angular dev origin (`localhost:4200`)
- [ ] Define base `Model` class and database session dependency

### Database


### Authentication (OAuth)
- [ ] Implement Google OAuth authorization URL endpoint
- [ ] Implement OAuth callback endpoint
- [ ] Issue JWT access + refresh tokens on successful login
- [ ] Create `GET /auth/me` endpoint returning current user
- [ ] Add `get_current_user` FastAPI dependency for protected routes
- [ ] Implement token refresh endpoint

### Users
- [ ] Define `User` model (id, email, name, avatar_url, provider, created_at)
- [ ] `GET /users/me` — current user profile
- [ ] `PATCH /users/me` — update display name / avatar

### Products
- [ ] Define `Product` model (id, name, description, price, stock, images, category)
- [ ] `GET /products` — paginated list with search and category filter
- [ ] `GET /products/{id}` — product detail
- [ ] `POST /products` — create product (admin only)
- [ ] `PATCH /products/{id}` — update product (admin only)
- [ ] `DELETE /products/{id}` — delete product (admin only)

### Cart
- [ ] Define `Cart` and `CartItem` models
- [ ] `GET /cart` — get current user's cart
- [ ] `POST /cart/items` — add item
- [ ] `PATCH /cart/items/{id}` — update quantity
- [ ] `DELETE /cart/items/{id}` — remove item
- [ ] `DELETE /cart` — clear cart

### Orders
- [ ] Define `Order` and `OrderItem` models with status enum
- [ ] `POST /orders` — create order from current cart
- [ ] `GET /orders` — list user's orders
- [ ] `GET /orders/{id}` — order detail
- [ ] `PATCH /orders/{id}/status` — update status (admin only)

---

## Frontend

### Project Setup
- [ ] Configure `environment.ts` / `environment.prod.ts` with API base URL
- [ ] Create `ApiService` with typed `HttpClient` wrapper
- [ ] Set up global error interceptor
- [ ] Set up auth interceptor to attach JWT to requests
- [ ] Define shared TypeScript interfaces (`User`, `Product`, `Cart`, `Order`)
- [ ] Set up lazy-loaded feature routes in `app.routes.ts`

### Authentication
- [ ] Create `AuthService` (login, logout, refresh token, `currentUser` signal)
- [ ] `AuthGuard` for protected routes
- [ ] Login page with OAuth provider buttons
- [ ] OAuth callback handler route
- [ ] User avatar / menu in navbar showing logged-in state

### Layout & Navigation
- [ ] `NavbarComponent` with logo, search bar, cart icon, user menu
- [ ] `FooterComponent`
- [ ] Responsive shell layout with router outlet

### Product Catalog
- [ ] `ProductListComponent` — grid with pagination, search, category filter
- [ ] `ProductCardComponent` — image, name, price, "Add to Cart" button
- [ ] `ProductDetailComponent` — full product page with image gallery

### Shopping Cart
- [ ] `CartService` with cart state as signal
- [ ] `CartDrawerComponent` — slide-in panel showing cart items
- [ ] `CartItemComponent` — quantity stepper, remove button
- [ ] Cart total and "Proceed to Checkout" CTA

### Checkout
- [ ] `CheckoutComponent` — order summary + shipping form
- [ ] Payment form integration
- [ ] Order confirmation page

### Orders
- [ ] `OrderHistoryComponent` — paginated list of past orders
- [ ] `OrderDetailComponent` — line items, status, total

### Admin
- [ ] Admin route group with `AdminGuard`
- [ ] `ProductFormComponent` — create / edit product
- [ ] `ProductManagementComponent` — table with edit / delete actions
- [ ] `OrderManagementComponent` — table with status update
