import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { register } from 'swiper/element/bundle';

import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../mock/mock-data';
import { Brand, Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card';

register();

const BRAND_SLIDER_PARAMS = {
  slidesPerView: 3,
  spaceBetween: 12,
  loop: true,
  autoplay: { delay: 2000, disableOnInteraction: false },
  speed: 600,
  breakpoints: {
    480: { slidesPerView: 4 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 8 },
  },
};

const SLIDER_PARAMS = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  navigation: true,
  pagination: { clickable: true },
  breakpoints: {
    480: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 3, spaceBetween: 24 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
  },
};

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="home">

      <section class="home__categories" aria-label="Browse by category">
        <button
          type="button"
          class="home__category-chip"
          [class.home__category-chip--active]="selectedCategory() === ''"
          (click)="selectedCategory.set('')"
        >
          All
        </button>
        @for (category of categories; track category) {
          <button
            type="button"
            class="home__category-chip"
            [class.home__category-chip--active]="selectedCategory() === category"
            (click)="selectedCategory.set(category)"
          >
            {{ category }}
          </button>
        }
      </section>

      <section class="home__brands-section" aria-label="Featured brands">
        <div class="home__slider-header">
          <h2 class="home__slider-title">Featured Brands</h2>
          <p class="home__slider-subtitle">Shop your favourite labels</p>
        </div>
        <swiper-container #brandSwiper init="false" class="home__brands-swiper">
          @for (brand of brands; track brand.id) {
            <swiper-slide class="home__brand-slide">
              <button type="button" class="home__brand-card" (click)="selectedCategory.set(brand.category)">
                <span class="home__brand-initial">{{ brand.name[0] }}</span>
                <span class="home__brand-name">{{ brand.name }}</span>
              </button>
            </swiper-slide>
          }
        </swiper-container>
      </section>

      <section class="home__slider-section">
        <div class="home__slider-header">
          <h2 class="home__slider-title">Popular Products</h2>
          <p class="home__slider-subtitle">Highest rated by our customers</p>
        </div>
        <swiper-container #popularSwiper init="false" class="home__swiper">
          @for (product of popularProducts; track product.id) {
            <swiper-slide>
              <app-product-card [product]="product" [isWishlisted]="wishlist.has(product.id)" (addToCart)="onAddToCart($event)" (wishlistToggle)="wishlist.toggle($event)" />
            </swiper-slide>
          }
        </swiper-container>
      </section>

      <section class="home__slider-section">
        <div class="home__slider-header">
          <h2 class="home__slider-title">New Arrivals</h2>
          <p class="home__slider-subtitle">Fresh picks just added to the store</p>
        </div>
        <swiper-container #newSwiper init="false" class="home__swiper">
          @for (product of newProducts; track product.id) {
            <swiper-slide>
              <app-product-card [product]="product" [isWishlisted]="wishlist.has(product.id)" (addToCart)="onAddToCart($event)" (wishlistToggle)="wishlist.toggle($event)" />
            </swiper-slide>
          }
        </swiper-container>
      </section>

      <section>
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
            <app-product-card [product]="product" [isWishlisted]="wishlist.has(product.id)" (addToCart)="onAddToCart($event)" (wishlistToggle)="wishlist.toggle($event)" />
          } @empty {
            <p class="home__empty">No products match your search.</p>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }

    .home__categories {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
      scrollbar-width: thin;
    }

    .home__category-chip {
      border: 1px solid var(--border-input);
      background: var(--surface, #ffffff);
      color: var(--text);
      border-radius: 999px;
      padding: 0.45rem 0.9rem;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    }

    .home__category-chip:hover {
      border-color: var(--primary);
    }

    .home__category-chip--active {
      background: var(--primary);
      color: var(--primary-contrast);
      border-color: var(--primary);
    }

    .home__brands-section { margin-bottom: 3rem; }

    .home__brands-swiper {
      --swiper-navigation-color: var(--primary);
      padding: 0.25rem 0 0.5rem !important;
    }

    .home__brand-slide { height: auto; box-sizing: border-box; padding: 4px; }

    .home__brand-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 1rem 0.5rem;
      border: 1px solid var(--border-input);
      border-radius: 0.75rem;
      background: var(--surface);
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .home__brand-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .home__brand-initial {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: var(--primary);
      color: var(--primary-contrast);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .home__brand-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .home__slider-section { margin-bottom: 3.5rem; }
    .home__slider-header { margin-bottom: 1.25rem; }
    .home__slider-title { font-size: 1.5rem; font-weight: 700; color: var(--text); margin: 0; }
    .home__slider-subtitle { font-size: 0.875rem; color: var(--text-muted); margin: 0.25rem 0 0; }

    .home__swiper {
      --swiper-navigation-color: var(--primary);
      --swiper-pagination-color: var(--primary);
      --swiper-navigation-size: 20px;
      padding-bottom: 2.75rem !important;
    }
    swiper-slide { height: auto; box-sizing: border-box; padding: 4px; }
    swiper-slide app-product-card { display: block; height: 100%; }

    .home__header { margin-bottom: 1.5rem; }
    .home__title { font-size: 1.75rem; font-weight: 700; color: var(--text); margin: 0; }
    .home__subtitle { font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0; }
    .home__controls { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .home__search { flex: 1; min-width: 200px; padding: 0.5rem 0.75rem; border: 1px solid var(--border-input); border-radius: 0.5rem; font-size: 0.9rem; }
    .home__search:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-ring); }
    .home__filter { padding: 0.5rem 0.75rem; border: 1px solid var(--border-input); border-radius: 0.5rem; font-size: 0.9rem; cursor: pointer; }
    .home__filter:focus { outline: none; border-color: var(--primary); }
    .home__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
    .home__empty { grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0; }
  `],
})
export class HomeComponent {
  private readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  private readonly brandSwiperRef = viewChild<ElementRef>('brandSwiper');
  private readonly popularSwiperRef = viewChild<ElementRef>('popularSwiper');
  private readonly newSwiperRef = viewChild<ElementRef>('newSwiper');

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly categories = MOCK_CATEGORIES;
  protected readonly brands: Brand[] = MOCK_BRANDS;

  protected readonly popularProducts = [...MOCK_PRODUCTS].sort((a, b) => b.rating.rate - a.rating.rate);
  protected readonly newProducts = [...MOCK_PRODUCTS].slice().reverse();

  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    return MOCK_PRODUCTS.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  constructor() {
    afterNextRender(() => {
      const brandEl = this.brandSwiperRef()?.nativeElement;
      if (brandEl) {
        Object.assign(brandEl, BRAND_SLIDER_PARAMS);
        brandEl.initialize();
      }

      const popularEl = this.popularSwiperRef()?.nativeElement;
      if (popularEl) {
        Object.assign(popularEl, SLIDER_PARAMS);
        popularEl.initialize();
      }

      const newEl = this.newSwiperRef()?.nativeElement;
      if (newEl) {
        Object.assign(newEl, SLIDER_PARAMS);
        newEl.initialize();
      }
    });
  }

  protected onAddToCart(product: Product): void {
    this.cart.addItem(product);
  }

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }
}
