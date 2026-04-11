import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MOCK_ORDERS } from '../../mock/mock-data';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="orders">
      <h1 class="orders__title">Order History</h1>

      @if (orders().length === 0) {
        <div class="orders__empty">
          <p>You haven't placed any orders yet.</p>
          <a routerLink="/" class="btn btn--primary">Start Shopping</a>
        </div>
      } @else {
        <div class="orders__list">
          @for (order of orders(); track order.id) {
            <div class="order-card" [class.order-card--expanded]="expandedId() === order.id">
              <div class="order-card__header" (click)="toggle(order.id)">
                <div class="order-card__meta">
                  <span class="order-card__id">{{ order.id }}</span>
                  <span class="order-card__date">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="order-card__right">
                  <span class="order-card__status" [class]="'status--' + order.status">
                    {{ order.status }}
                  </span>
                  <span class="order-card__total">\${{ order.total.toFixed(2) }}</span>
                  <span class="order-card__chevron">{{ expandedId() === order.id ? '▲' : '▼' }}</span>
                </div>
              </div>

              @if (expandedId() === order.id) {
                <div class="order-card__body">
                  <div class="order-card__shipping">
                    <strong>Ship to:</strong> {{ order.shipping.fullName }},
                    {{ order.shipping.address }}, {{ order.shipping.city }},
                    {{ order.shipping.postalCode }}, {{ order.shipping.country }}
                  </div>
                  <ul class="order-card__lines">
                    @for (line of order.lines; track line.productId) {
                      <li class="order-line">
                        <img [src]="line.image" [alt]="line.title" class="order-line__img" />
                        <span class="order-line__title">{{ line.title }}</span>
                        <span class="order-line__qty">× {{ line.quantity }}</span>
                        <span class="order-line__price">\${{ (line.price * line.quantity).toFixed(2) }}</span>
                      </li>
                    }
                  </ul>
                  <div class="order-card__total-row">
                    <span>Order Total</span>
                    <strong>\${{ order.total.toFixed(2) }}</strong>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
    .orders__title { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
    .orders__empty { text-align: center; padding: 4rem 0; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .orders__list { display: flex; flex-direction: column; gap: 1rem; }
    .order-card { border: 1px solid #e5e7eb; border-radius: 0.75rem; background: #fff; overflow: hidden; }
    .order-card__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; cursor: pointer; user-select: none; transition: background 0.15s; }
    .order-card__header:hover { background: #f9fafb; }
    .order-card__meta { display: flex; flex-direction: column; gap: 0.2rem; }
    .order-card__id { font-weight: 700; font-size: 0.95rem; color: #111827; }
    .order-card__date { font-size: 0.8rem; color: #6b7280; }
    .order-card__right { display: flex; align-items: center; gap: 1rem; }
    .order-card__status { font-size: 0.75rem; font-weight: 600; text-transform: capitalize; padding: 0.2rem 0.6rem; border-radius: 9999px; }
    .status--pending { background: #fef9c3; color: #854d0e; }
    .status--processing { background: #dbeafe; color: #1e40af; }
    .status--shipped { background: #e0f2fe; color: #0369a1; }
    .status--delivered { background: #dcfce7; color: #166534; }
    .status--cancelled { background: #fee2e2; color: #991b1b; }
    .order-card__total { font-weight: 700; font-size: 0.95rem; color: #111827; }
    .order-card__chevron { color: #9ca3af; font-size: 0.7rem; }
    .order-card__body { padding: 0 1.25rem 1.25rem; border-top: 1px solid #f3f4f6; }
    .order-card__shipping { font-size: 0.82rem; color: #6b7280; padding: 0.75rem 0; }
    .order-card__lines { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .order-line { display: flex; align-items: center; gap: 0.75rem; }
    .order-line__img { width: 48px; height: 48px; object-fit: contain; background: #f9fafb; border-radius: 0.4rem; padding: 4px; flex-shrink: 0; }
    .order-line__title { flex: 1; font-size: 0.85rem; color: #374151; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .order-line__qty { font-size: 0.8rem; color: #6b7280; }
    .order-line__price { font-size: 0.85rem; font-weight: 600; color: #111827; white-space: nowrap; }
    .order-card__total-row { display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #f3f4f6; margin-top: 0.75rem; font-size: 0.9rem; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: none; text-align: center; transition: all 0.2s; display: inline-block; }
    .btn--primary { background: #6366f1; color: #fff; }
    .btn--primary:hover { background: #4f46e5; }
  `]
})
export class OrdersComponent {
  protected readonly orders = signal<Order[]>(MOCK_ORDERS);
  protected readonly expandedId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
