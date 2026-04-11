import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout">
      <h1 class="checkout__title">Checkout</h1>

      @if (cart.items().length === 0 && !orderPlaced()) {
        <div class="checkout__empty">
          <p>Your cart is empty.</p>
          <a routerLink="/" class="btn btn--primary">Browse Products</a>
        </div>
      } @else if (orderPlaced()) {
        <div class="checkout__success">
          <div class="checkout__success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <div class="checkout__success-actions">
            <a routerLink="/orders" class="btn btn--primary">View Orders</a>
            <a routerLink="/" class="btn btn--outline">Continue Shopping</a>
          </div>
        </div>
      } @else {
        <div class="checkout__layout">
          <form [formGroup]="form" (ngSubmit)="placeOrder()" class="checkout__form">
            <section class="checkout__section">
              <h2 class="checkout__section-title">Shipping Address</h2>
              <div class="form-row">
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input id="fullName" type="text" formControlName="fullName" placeholder="John Doe" />
                  @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
                    <span class="form-error">Full name is required.</span>
                  }
                </div>
              </div>
              <div class="form-row">
                <div class="form-group form-group--full">
                  <label for="address">Address</label>
                  <input id="address" type="text" formControlName="address" placeholder="123 Main St" />
                  @if (form.get('address')?.invalid && form.get('address')?.touched) {
                    <span class="form-error">Address is required.</span>
                  }
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input id="city" type="text" formControlName="city" placeholder="New York" />
                  @if (form.get('city')?.invalid && form.get('city')?.touched) {
                    <span class="form-error">City is required.</span>
                  }
                </div>
                <div class="form-group">
                  <label for="postalCode">Postal Code</label>
                  <input id="postalCode" type="text" formControlName="postalCode" placeholder="10001" />
                  @if (form.get('postalCode')?.invalid && form.get('postalCode')?.touched) {
                    <span class="form-error">Postal code is required.</span>
                  }
                </div>
                <div class="form-group">
                  <label for="country">Country</label>
                  <input id="country" type="text" formControlName="country" placeholder="US" />
                  @if (form.get('country')?.invalid && form.get('country')?.touched) {
                    <span class="form-error">Country is required.</span>
                  }
                </div>
              </div>
            </section>

            <section class="checkout__section">
              <h2 class="checkout__section-title">Payment</h2>
              <p class="checkout__payment-note">
                💳 Payment integration coming soon. Orders will be placed in demo mode.
              </p>
            </section>

            <button
              type="submit"
              class="btn btn--primary btn--block"
              [disabled]="form.invalid || submitting()"
            >
              {{ submitting() ? 'Placing Order...' : 'Place Order • $' + cart.total().toFixed(2) }}
            </button>
          </form>

          <aside class="checkout__summary">
            <h2 class="checkout__summary-title">Order Summary</h2>
            @for (item of cart.items(); track item.product.id) {
              <div class="checkout__line">
                <img [src]="item.product.image" [alt]="item.product.title" class="checkout__line-img" />
                <span class="checkout__line-title">{{ item.product.title }}</span>
                <span class="checkout__line-qty">× {{ item.quantity }}</span>
                <span class="checkout__line-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
              </div>
            }
            <hr class="checkout__divider" />
            <div class="checkout__total">
              <span>Total</span>
              <strong>\${{ cart.total().toFixed(2) }}</strong>
            </div>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
    .checkout__title { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
    .checkout__empty { text-align: center; padding: 4rem 0; color: #6b7280; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .checkout__layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
    @media (max-width: 768px) { .checkout__layout { grid-template-columns: 1fr; } }
    .checkout__form { display: flex; flex-direction: column; gap: 1.5rem; }
    .checkout__section { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem; }
    .checkout__section-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 1.25rem; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 140px; }
    .form-group--full { flex-basis: 100%; }
    .form-group label { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .form-group input { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.9rem; }
    .form-group input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
    .form-error { font-size: 0.75rem; color: #ef4444; }
    .checkout__payment-note { color: #6b7280; font-size: 0.9rem; margin: 0; padding: 1rem; background: #f9fafb; border-radius: 0.5rem; }
    .checkout__summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .checkout__summary-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    .checkout__line { display: flex; align-items: center; gap: 0.75rem; }
    .checkout__line-img { width: 48px; height: 48px; object-fit: contain; background: #f9fafb; border-radius: 0.4rem; padding: 4px; flex-shrink: 0; }
    .checkout__line-title { flex: 1; font-size: 0.82rem; color: #374151; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .checkout__line-qty { font-size: 0.8rem; color: #6b7280; white-space: nowrap; }
    .checkout__line-price { font-size: 0.85rem; font-weight: 600; color: #111827; white-space: nowrap; }
    .checkout__divider { border: none; border-top: 1px solid #e5e7eb; }
    .checkout__total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; color: #111827; }
    .checkout__success { max-width: 480px; margin: 4rem auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .checkout__success-icon { width: 72px; height: 72px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #16a34a; }
    .checkout__success h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
    .checkout__success p { color: #6b7280; margin: 0; }
    .checkout__success-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: none; text-align: center; transition: all 0.2s; display: inline-block; }
    .btn--primary { background: #6366f1; color: #fff; }
    .btn--primary:hover:not(:disabled) { background: #4f46e5; }
    .btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn--outline { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn--outline:hover { background: #eef2ff; }
    .btn--block { display: block; width: 100%; }
  `]
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);

  protected readonly submitting = signal(false);
  protected readonly orderPlaced = signal(false);

  protected readonly form = this.fb.group({
    fullName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required]
  });

  protected async placeOrder(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    // Simulate async order submission
    await new Promise(resolve => setTimeout(resolve, 1200));
    this.cart.clear();
    this.submitting.set(false);
    this.orderPlaced.set(true);
  }
}
