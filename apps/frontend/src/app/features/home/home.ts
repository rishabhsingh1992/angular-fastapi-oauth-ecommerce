import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { register } from 'swiper/element/bundle';

import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../mock/mock-data';
import { Brand, Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card';

register();

type SwiperContainerElement = HTMLElement & {
  initialize: () => void;
};

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
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly brandSwiperRef = viewChild<ElementRef<SwiperContainerElement>>('brandSwiper');
  private readonly popularSwiperRef = viewChild<ElementRef<SwiperContainerElement>>('popularSwiper');
  private readonly newSwiperRef = viewChild<ElementRef<SwiperContainerElement>>('newSwiper');

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly selectedSort = signal<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  protected readonly categories = MOCK_CATEGORIES;
  protected readonly brands: Brand[] = MOCK_BRANDS;

  protected readonly popularProducts = [...MOCK_PRODUCTS].sort((a, b) => b.rating.rate - a.rating.rate);
  protected readonly newProducts = [...MOCK_PRODUCTS].slice().reverse();
  protected readonly featuredProduct = this.popularProducts[0] ?? null;
  protected readonly averageRating =
    MOCK_PRODUCTS.reduce((sum, product) => sum + product.rating.rate, 0) / MOCK_PRODUCTS.length;
  protected readonly hasActiveFilters = computed(
    () => !!this.searchQuery().trim() || !!this.selectedCategory() || this.selectedSort() !== 'featured',
  );

  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();
    const sort = this.selectedSort();
    const filteredProducts = MOCK_PRODUCTS.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });

    switch (sort) {
      case 'price-asc':
        return [...filteredProducts].sort((left, right) => left.price - right.price);
      case 'price-desc':
        return [...filteredProducts].sort((left, right) => right.price - left.price);
      case 'rating':
        return [...filteredProducts].sort((left, right) => right.rating.rate - left.rating.rate);
      default:
        return filteredProducts;
    }
  });

  constructor() {
    effect(() => {
      const query = this.queryParamMap().get('q') ?? '';
      if (query !== this.searchQuery()) {
        this.searchQuery.set(query);
      }
    });

    afterNextRender(() => {
      this.initializeSwiper(this.brandSwiperRef()?.nativeElement, BRAND_SLIDER_PARAMS);
      this.initializeSwiper(this.popularSwiperRef()?.nativeElement, SLIDER_PARAMS);
      this.initializeSwiper(this.newSwiperRef()?.nativeElement, SLIDER_PARAMS);
    });
  }

  protected onAddToCart(product: Product): void {
    this.cart.addItem(product);
  }

  protected onSelectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected onCategoryChange(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  protected onSortChange(event: Event): void {
    this.selectedSort.set(
      (event.target as HTMLSelectElement).value as 'featured' | 'price-asc' | 'price-desc' | 'rating',
    );
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedSort.set('featured');
  }

  private initializeSwiper(
    container: SwiperContainerElement | undefined,
    params: Readonly<Record<string, unknown>>,
  ): void {
    if (!container) {
      return;
    }

    Object.assign(container, params);
    container.initialize();
  }
}
