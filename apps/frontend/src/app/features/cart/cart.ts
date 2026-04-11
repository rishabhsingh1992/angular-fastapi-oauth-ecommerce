import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="cart">
      <h1 class="cart__title">Shopping Cart</h1>

      @if (cart.items().length === 0) {
        <div class="cart__empty">
          <p>Your cart is empty.</p>
          <a routerLink="/" class="btn btn--primary">Continue Shopping</a>
        </div>
      } @else {
        <div class="cart__layout">
          <ul class="cart__list">
            @for (item of cart.items(); track item.product.id) {
              <li class="cart__item">
                <img [src]="item.product.image" [alt]="item.product.title" class="cart__item-image" />
                <div class="cart__item-info">
                  <a [routerLink]="['/products', item.product.id]" class="cart__item-title">
                    {{ item.product.title }}
                  </a>
                  <span class="cart__item-price">\${{ item.product.price.toFixed(2) }} each</span>
                </div>
                <div class="cart__item-qty">
                  <button type="button" class="qty-btn" (click)="cart.updateQuantity(item.product.id, item.quantity - 1)">−</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button type="button" class="qty-btn" (click)="cart.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                </div>
                <span class="cart__item-subtotal">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                <button
                  type="button"
                  class="cart__item-remove"
                  (click)="cart.removeItem(item.product.id)"
                  aria-label="Remove item"
                >✕</button>
              </li>
            }
          </ul>

          <aside class="cart__summary">
            <h2 class="cart__summary-title">Order Summary</h2>
            <div class="cart__summary-row">
              <span>Items ({{ cart.itemCount() }})</span>
              <span>\${{ cart.total().toFixed(2) }}</span>
            </div>
            <div class="cart__summary-row">
              <span>Shipping</span>
              <span class="cart__free">Free</span>
            </div>
            <hr class="cart__divider" />
            <div class="cart__summary-row cart__summary-total">
              <span>Total</span>
              <span>\${{ cart.total().toFixed(2) }}</span>
            </div>
            <a routerLink="/checkout" class="btn btn--primary btn--block">Proceed to Checkout</a>
            <a routerLink="/" class="btn btn--ghost btn--block">Continue Shopping</a>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
    .cart__title { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
    .cart__empty { text-align: center; padding: 4rem 0; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .cart__layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
    @media (max-width: 768px) { .cart__layout { grid-template-columns: 1fr; } }
    .cart__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
    .cart__item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background: #fff; }
    .cart__item-image { width: 72px; height: 72px; object-fit: contain; border-radius: 0.5rem; background: #f9fafb; padding: 4px; flex-shrink: 0; }
    .cart__item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.25rem; }
    .cart__item-title { font-size: 0.9rem; font-weight: 600; color: #111827; text-decoration: none; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .cart__item-title:hover { color: #6366f1; }
    .cart__item-price { font-size: 0.8rem; color: #6b7280; }
    .cart__item-qty { display: flex; align-items: center; gap: 0.5rem; }
    .qty-btn { width: 28px; height: 28px; border: 1px solid #d1d5db; border-radius: 0.4rem; background: #fff; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .qty-btn:hover { background: #f3f4f6; }
    .qty-value { width: 28px; text-align: center; font-weight: 600; font-size: 0.9rem; }
    .cart__item-subtotal { font-weight: 700; font-size: 0.95rem; color: #111827; min-width: 64px; text-align: right; }
    .cart__item-remove { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1rem; padding: 0.25rem; transition: color 0.2s; }
    .cart__item-remove:hover { color: #ef4444; }
    .cart__summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .cart__summary-title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    .cart__summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #374151; }
    .cart__free { color: #16a34a; font-weight: 500; }
    .cart__divider { border: none; border-top: 1px solid #e5e7eb; margin: 0.25rem 0; }
    .cart__summary-total { font-weight: 700; font-size: 1.05rem; color: #111827; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: none; text-align: center; transition: all 0.2s; display: inline-block; }
    .btn--primary { background: #6366f1; color: #fff; }
    .btn--primary:hover { background: #4f46e5; }
    .btn--ghost { background: transparent; color: #6b7280; }
    .btn--ghost:hover { background: #f3f4f6; color: #374151; }
    .btn--block { display: block; width: 100%; }
  `]
})
export class CartComponent {
  protected readonly cart = inject(CartService);
}
