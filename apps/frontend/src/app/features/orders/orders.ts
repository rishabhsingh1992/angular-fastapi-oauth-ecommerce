import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MOCK_ORDERS } from '../../mock/mock-data';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  protected readonly orders = signal<Order[]>(MOCK_ORDERS);
  protected readonly expandedId = signal<string | null>(null);
  private readonly dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  protected toggle(id: string): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  protected isExpanded(orderId: string): boolean {
    return this.expandedId() === orderId;
  }

  protected onHeaderKeydown(event: KeyboardEvent, orderId: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.toggle(orderId);
  }

  protected formatDate(iso: string): string {
    return this.dateFormatter.format(new Date(iso));
  }
}
