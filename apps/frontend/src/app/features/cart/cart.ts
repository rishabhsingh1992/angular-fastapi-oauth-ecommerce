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

  protected async onIncreaseQuantity(productId: number, quantity: number): Promise<void> {
    await this.cart.updateQuantity(productId, quantity + 1);
  }

  protected async onDecreaseQuantity(productId: number, quantity: number): Promise<void> {
    await this.cart.updateQuantity(productId, quantity - 1);
  }

  protected async onRemoveItem(productId: number): Promise<void> {
    await this.cart.removeItem(productId);
  }
}
