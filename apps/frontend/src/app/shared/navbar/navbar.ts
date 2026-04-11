import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar__inner">
        <a routerLink="/" class="navbar__logo">ShopFast</a>

        <div class="navbar__links">
          <a routerLink="/" routerLinkActive="navbar__link--active" [routerLinkActiveOptions]="{ exact: true }" class="navbar__link">
            Products
          </a>
          <a routerLink="/orders" routerLinkActive="navbar__link--active" class="navbar__link">
            Orders
          </a>
        </div>

        <div class="navbar__actions">
          <a routerLink="/cart" class="navbar__cart">
            🛒
            @if (cartCount() > 0) {
              <span class="navbar__badge">{{ cartCount() }}</span>
            }
          </a>

          @if (auth.isLoggedIn()) {
            <div class="navbar__user">
              <img [src]="auth.currentUser()!.avatarUrl" [alt]="auth.currentUser()!.name" class="navbar__avatar" />
              <span class="navbar__username">{{ auth.currentUser()!.name }}</span>
              <button type="button" class="btn btn--ghost" (click)="auth.logout()">Logout</button>
            </div>
          } @else {
            <a routerLink="/login" class="btn btn--primary">Sign In</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; }
    .navbar__inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; gap: 2rem; height: 64px; }
    .navbar__logo { font-size: 1.25rem; font-weight: 800; color: #6366f1; text-decoration: none; margin-right: auto; }
    .navbar__links { display: flex; gap: 1.5rem; }
    .navbar__link { text-decoration: none; color: #374151; font-size: 0.9rem; font-weight: 500; padding-bottom: 2px; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
    .navbar__link:hover, .navbar__link--active { color: #6366f1; border-bottom-color: #6366f1; }
    .navbar__actions { display: flex; align-items: center; gap: 1rem; }
    .navbar__cart { position: relative; font-size: 1.4rem; text-decoration: none; display: inline-flex; }
    .navbar__badge { position: absolute; top: -6px; right: -8px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 9999px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
    .navbar__user { display: flex; align-items: center; gap: 0.5rem; }
    .navbar__avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
    .navbar__username { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .btn { padding: 0.4rem 1rem; border-radius: 0.4rem; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: background 0.2s; }
    .btn--primary { background: #6366f1; color: #fff; }
    .btn--primary:hover { background: #4f46e5; }
    .btn--ghost { background: transparent; color: #6b7280; }
    .btn--ghost:hover { background: #f3f4f6; color: #374151; }
  `]
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cartCount = inject(CartService).itemCount;
}
