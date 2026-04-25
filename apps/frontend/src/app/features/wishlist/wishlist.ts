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
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent {
  protected readonly wishlist = inject(WishlistService);
  private readonly cart = inject(CartService);

  protected readonly wishlistCountLabel = () =>
    `${this.wishlist.count()} ${this.wishlist.count() === 1 ? 'item' : 'items'} saved`;

  protected onAddToCart(product: Product): void {
    this.cart.addItem(product);
  }

  protected addAllToCart(): void {
    const items = this.wishlist.items();
    for (const product of items) {
      this.cart.addItem(product);
    }
  }
}
