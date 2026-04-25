import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  protected readonly cart = inject(CartService);

  protected onIncreaseQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity + 1);
  }

  protected onDecreaseQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity - 1);
  }

  protected onRemoveItem(productId: number): void {
    this.cart.removeItem(productId);
  }
}
