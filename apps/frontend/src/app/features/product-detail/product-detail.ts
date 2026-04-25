import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MOCK_PRODUCTS } from '../../mock/mock-data';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private addFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly cartCount = this.cart.itemCount;
  protected readonly added = signal(false);
  protected readonly quantity = signal(1);

  protected readonly product = computed(() => {
    const id = Number(this.paramMap().get('id'));
    return MOCK_PRODUCTS.find(p => p.id === id) ?? null;
  });
  protected readonly isWishlisted = computed(() => {
    const product = this.product();
    return product ? this.wishlist.has(product.id) : false;
  });
  protected readonly relatedProducts = computed(() => {
    const product = this.product();
    if (!product) {
      return [];
    }

    const sameCategory = MOCK_PRODUCTS.filter(
      candidate => candidate.id !== product.id && candidate.category === product.category,
    );
    const fallback = MOCK_PRODUCTS.filter(candidate => candidate.id !== product.id);

    return (sameCategory.length > 0 ? sameCategory : fallback).slice(0, 4);
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.addFeedbackTimeout !== null) {
        clearTimeout(this.addFeedbackTimeout);
      }
    });

    effect(() => {
      this.product()?.id;
      this.quantity.set(1);
      this.added.set(false);
    });
  }

  protected addToCart(): void {
    const p = this.product();
    if (!p) {
      return;
    }

    for (let index = 0; index < this.quantity(); index += 1) {
      this.cart.addItem(p);
    }

    this.added.set(true);

    if (this.addFeedbackTimeout !== null) {
      clearTimeout(this.addFeedbackTimeout);
    }

    this.addFeedbackTimeout = setTimeout(() => {
      this.added.set(false);
      this.addFeedbackTimeout = null;
    }, 2000);
  }

  protected decreaseQuantity(): void {
    this.quantity.update(current => Math.max(1, current - 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update(current => Math.min(10, current + 1));
  }

  protected toggleWishlist(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.wishlist.toggle(product);
  }

  protected onAddRelatedToCart(product: Product): void {
    this.cart.addItem(product);
  }
}
