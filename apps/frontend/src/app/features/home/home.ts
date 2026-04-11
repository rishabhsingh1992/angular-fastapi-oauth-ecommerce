import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../mock/mock-data';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
  template: `
    <div class="home">
      <header class="home__header">
        <h1 class="home__title">All Products</h1>
        <p class="home__subtitle">{{ filteredProducts().length }} items</p>
      </header>

      <div class="home__controls">
        <input
          type="search"
          class="home__search"
          placeholder="Search products..."
          [value]="searchQuery()"
          (input)="searchQuery.set(getInputValue($event))"
        />
        <select
          class="home__filter"
          [value]="selectedCategory()"
          (change)="selectedCategory.set(getInputValue($event))"
        >
          <option value="">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>

      <div class="home__grid">
        @for (product of filteredProducts(); track product.id) {
          <app-product-card [product]="product" (addToCart)="onAddToCart($event)" />
        } @empty {
          <p class="home__empty">No products match your search.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .home { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .home__header { margin-bottom: 1.5rem; }
    .home__title { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0; }
    .home__subtitle { font-size: 0.9rem; color: #6b7280; margin: 0.25rem 0 0; }
    .home__controls { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .home__search { flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.9rem; }
    .home__search:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
    .home__filter { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.9rem; background: #fff; cursor: pointer; }
    .home__filter:focus { outline: none; border-color: #6366f1; }
    .home__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
    .home__empty { grid-column: 1/-1; text-align: center; color: #6b7280; padding: 3rem 0; }
  `]
})
export class HomeComponent {
  private readonly cart = inject(CartService);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly categories = MOCK_CATEGORIES;

  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    return MOCK_PRODUCTS.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  protected onAddToCart(product: Product): void {
    this.cart.addItem(product);
  }

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }
}
