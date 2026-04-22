import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-wishlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <div class="wishlist">
      <header class="wishlist__header">
        <div>
          <h1 class="wishlist__title">My Wishlist</h1>
          <p class="wishlist__subtitle">
            {{ wishlist.count() }} {{ wishlist.count() === 1 ? 'item' : 'items' }} saved
          </p>
        </div>
        @if (wishlist.count() > 0) {
          <button type="button" class="btn btn--ghost" (click)="addAllToCart()">
            Add All to Cart
          </button>
        }
      </header>

      @if (wishlist.items().length === 0) {
        <div class="wishlist__empty">
          <div class="wishlist__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2 class="wishlist__empty-heading">Your wishlist is empty</h2>
          <p class="wishlist__empty-text">Save items you love and come back to them later.</p>
          <a routerLink="/" class="btn btn--primary">Browse Products</a>
        </div>
      } @else {
        <div class="wishlist__grid">
          @for (product of wishlist.items(); track product.id) {
            <app-product-card
              [product]="product"
              [isWishlisted]="true"
              (addToCart)="onAddToCart($event)"
              (wishlistToggle)="wishlist.toggle($event)"
            />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .wishlist__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
    .wishlist__title { font-size: 1.75rem; font-weight: 700; color: var(--text); margin: 0; }
    .wishlist__subtitle { font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0; }
    .wishlist__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
    .wishlist__empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 5rem 0; text-align: center; }
    .wishlist__empty-icon { width: 88px; height: 88px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-faint); }
    .wishlist__empty-heading { font-size: 1.25rem; font-weight: 700; color: var(--text); margin: 0; }
    .wishlist__empty-text { color: var(--text-muted); font-size: 0.95rem; margin: 0; max-width: 320px; }
    .btn { padding: 0.5rem 1.1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; display: inline-block; }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { background: var(--primary-hover); }
    .btn--ghost { background: var(--bg); color: var(--text-secondary); border: 1px solid var(--border-input); }
    .btn--ghost:hover { background: var(--bg-secondary); color: var(--text); }
  `]
})
export class WishlistComponent {
  protected readonly wishlist = inject(WishlistService);
  private readonly cart = inject(CartService);

  protected onAddToCart(product: Product): void {
    this.cart.addItem(product);
  }

  protected addAllToCart(): void {
    for (const product of this.wishlist.items()) {
      this.cart.addItem(product);
    }
  }
}
