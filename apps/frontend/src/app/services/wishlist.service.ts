import { Injectable, computed, signal } from '@angular/core';

import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _items = signal<Product[]>(this.load());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);

  has(productId: number): boolean {
    return this._items().some(p => p.id === productId);
  }

  toggle(product: Product): void {
    this._items.update(items => {
      const next = items.some(p => p.id === product.id)
        ? items.filter(p => p.id !== product.id)
        : [...items, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  }

  private load(): Product[] {
    try {
      const raw = localStorage.getItem('wishlist');
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }
}
