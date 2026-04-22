import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MOCK_PRODUCTS } from '../../mock/mock-data';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="detail">
      <a routerLink="/" class="detail__back">← Back to products</a>

      @if (product(); as p) {
        <div class="detail__card">
          <div class="detail__image-wrap">
            <img [src]="p.image" [alt]="p.title" class="detail__image" />
          </div>
          <div class="detail__info">
            <span class="detail__category">{{ p.category }}</span>
            <h1 class="detail__title">{{ p.title }}</h1>
            <div class="detail__rating">
              <span class="detail__stars">★ {{ p.rating.rate }}</span>
              <span class="detail__count">({{ p.rating.count }} reviews)</span>
            </div>
            <p class="detail__price">\${{ p.price.toFixed(2) }}</p>
            <p class="detail__description">{{ p.description }}</p>
            <div class="detail__actions">
              <button
                type="button"
                class="btn btn--primary"
                (click)="addToCart()"
              >
                Add to Cart
              </button>
              <a routerLink="/cart" class="btn btn--outline">View Cart ({{ cartCount() }})</a>
            </div>
            @if (added()) {
              <p class="detail__confirm">Added to cart!</p>
            }
          </div>
        </div>
      } @else {
        <p class="detail__not-found">Product not found.</p>
      }
    </div>
  `,
  styles: [`
    .detail { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem; }
    .detail__back { display: inline-block; color: var(--primary); text-decoration: none; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .detail__back:hover { text-decoration: underline; }
    .detail__card { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    @media (max-width: 640px) { .detail__card { grid-template-columns: 1fr; } }
    .detail__image-wrap { background: var(--bg-secondary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .detail__image { width: 100%; max-height: 380px; object-fit: contain; }
    .detail__info { display: flex; flex-direction: column; gap: 1rem; }
    .detail__category { font-size: 0.8rem; text-transform: capitalize; color: var(--text-muted); }
    .detail__title { font-size: 1.5rem; font-weight: 700; color: var(--text); margin: 0; line-height: 1.3; }
    .detail__rating { font-size: 0.9rem; color: var(--text-muted); }
    .detail__stars { color: #f59e0b; }
    .detail__price { font-size: 2rem; font-weight: 800; color: var(--primary); margin: 0; }
    .detail__description { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
    .detail__actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .detail__confirm { color: #16a34a; font-size: 0.9rem; font-weight: 500; }
    .detail__not-found { color: var(--text-muted); }
    .btn { padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { background: var(--primary-hover); }
    .btn--outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
    .btn--outline:hover { background: var(--primary-subtle); }
  `]
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cart = inject(CartService);

  protected readonly cartCount = this.cart.itemCount;
  protected readonly added = signal(false);

  protected readonly product = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return MOCK_PRODUCTS.find(p => p.id === id) ?? null;
  });

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.addItem(p);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }
}
