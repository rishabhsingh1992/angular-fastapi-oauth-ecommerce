import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../api/api.service';
import { AddCartItemRequest, CartItemResponse, CartResponse } from '../api/api.types';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);
  private readonly _items = signal<CartItemResponse[]>([]);
  private readonly _total = signal(0);
  private readonly _loading = signal(false);

  readonly items = this._items.asReadonly();
  readonly total = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));

  async loadCart(): Promise<void> {
    this._loading.set(true);
    try {
      const cart = await firstValueFrom(this.api.getCart());
      this._items.set(cart.items);
      this._total.set(cart.total);
    } finally {
      this._loading.set(false);
    }
  }

  async addItem(productId: number, quantity: number = 1): Promise<void> {
    this._loading.set(true);
    try {
      const cart = await firstValueFrom(this.api.addCartItem({ product_id: productId, quantity }));
      this._items.set(cart.items);
      this._total.set(cart.total);
    } finally {
      this._loading.set(false);
    }
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(productId);
      return;
    }

    this._loading.set(true);
    try {
      const cart = await firstValueFrom(this.api.updateCartItem(productId, { quantity }));
      this._items.set(cart.items);
      this._total.set(cart.total);
    } finally {
      this._loading.set(false);
    }
  }

  async removeItem(productId: number): Promise<void> {
    this._loading.set(true);
    try {
      const cart = await firstValueFrom(this.api.removeCartItem(productId));
      this._items.set(cart.items);
      this._total.set(cart.total);
    } finally {
      this._loading.set(false);
    }
  }

  async clear(): Promise<void> {
    this._loading.set(true);
    try {
      const cart = await firstValueFrom(this.api.clearCart());
      this._items.set(cart.items);
      this._total.set(cart.total);
    } finally {
      this._loading.set(false);
    }
  }
}
