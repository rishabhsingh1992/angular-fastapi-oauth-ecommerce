import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../api/api.service';
import { ApiError, Order } from '../../api/api.types';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  protected readonly orderId = signal('');
  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly api = inject(ApiService);
  private readonly dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  protected trackOrder(): void {
    const id = this.orderId().trim();
    if (!id) {
      this.error.set('Please enter an order ID.');
      this.order.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (apiError: ApiError) => {
        this.order.set(null);
        this.loading.set(false);
        this.error.set(apiError.message || 'Could not fetch order status.');
      },
    });
  }

  protected formatDate(iso: string): string {
    return this.dateFormatter.format(new Date(iso));
  }
}
