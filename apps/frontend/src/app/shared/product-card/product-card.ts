import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="product-card">
      <div class="product-card__image-wrap">
        <a [routerLink]="['/products', product().id]" class="product-card__image-link">
          <img
            [src]="product().image"
            [alt]="product().title"
            class="product-card__image"
            loading="lazy"
          />
        </a>
        <button
          type="button"
          class="product-card__wish"
          [class.product-card__wish--active]="isWishlisted()"
          (click)="wishlistToggle.emit(product())"
          [title]="isWishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
        >
          @if (isWishlisted()) {
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          } @else {
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          }
        </button>
      </div>
      <div class="product-card__body">
        <span class="product-card__category">{{ product().category }}</span>
        <a [routerLink]="['/products', product().id]" class="product-card__title">
          {{ product().title }}
        </a>
        <div class="product-card__rating">
          <span class="product-card__stars">★ {{ product().rating.rate }}</span>
          <span class="product-card__count">({{ product().rating.count }})</span>
        </div>
        <div class="product-card__footer">
          <span class="product-card__price">\${{ product().price.toFixed(2) }}</span>
          <button
            type="button"
            class="btn btn--primary"
            (click)="addToCart.emit(product())"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      overflow: hidden;
      background: var(--bg);
      transition: box-shadow 0.2s;
    }
    .product-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .product-card__image-wrap { position: relative; }
    .product-card__image-link { display: block; background: var(--bg-secondary); }
    .product-card__image { width: 100%; height: 200px; object-fit: contain; padding: 1rem; }
    .product-card__wish {
      position: absolute; top: 0.5rem; right: 0.5rem;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 50%; width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--text-muted);
      transition: color 0.2s, border-color 0.2s, background 0.2s;
    }
    .product-card__wish:hover { color: #ef4444; border-color: #ef4444; }
    .product-card__wish--active { color: #ef4444; border-color: #ef4444; }
    .product-card__body { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; flex: 1; }
    .product-card__category { font-size: 0.75rem; text-transform: capitalize; color: var(--text-muted); }
    .product-card__title {
      font-size: 0.9rem; font-weight: 600; color: var(--text);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      text-decoration: none;
    }
    .product-card__title:hover { color: var(--primary); }
    .product-card__rating { font-size: 0.8rem; color: var(--text-muted); }
    .product-card__stars { color: #f59e0b; }
    .product-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
    .product-card__price { font-size: 1.1rem; font-weight: 700; color: var(--text); }
    .btn { padding: 0.4rem 0.9rem; border-radius: 0.4rem; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: background 0.2s; }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { background: var(--primary-hover); }
  `]
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly isWishlisted = input(false);
  readonly addToCart = output<Product>();
  readonly wishlistToggle = output<Product>();
}
