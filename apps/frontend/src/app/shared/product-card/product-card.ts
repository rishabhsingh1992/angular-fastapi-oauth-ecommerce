import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="product-card">
      <a [routerLink]="['/products', product().id]" class="product-card__image-link">
        <img
          [src]="product().image"
          [alt]="product().title"
          class="product-card__image"
          loading="lazy"
        />
      </a>
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
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      background: #fff;
      transition: box-shadow 0.2s;
    }
    .product-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .product-card__image-link { display: block; background: #f9fafb; }
    .product-card__image { width: 100%; height: 200px; object-fit: contain; padding: 1rem; }
    .product-card__body { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; flex: 1; }
    .product-card__category { font-size: 0.75rem; text-transform: capitalize; color: #6b7280; }
    .product-card__title {
      font-size: 0.9rem; font-weight: 600; color: #111827;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      text-decoration: none;
    }
    .product-card__title:hover { color: #6366f1; }
    .product-card__rating { font-size: 0.8rem; color: #6b7280; }
    .product-card__stars { color: #f59e0b; }
    .product-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
    .product-card__price { font-size: 1.1rem; font-weight: 700; color: #111827; }
    .btn { padding: 0.4rem 0.9rem; border-radius: 0.4rem; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: background 0.2s; }
    .btn--primary { background: #6366f1; color: #fff; }
    .btn--primary:hover { background: #4f46e5; }
  `]
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();
}
