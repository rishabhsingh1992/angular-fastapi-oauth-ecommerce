import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { WishlistService } from '../../services/wishlist.service';

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
          <a routerLink="/wishlist" class="navbar__icon-link" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            @if (wishlistCount() > 0) {
              <span class="navbar__badge navbar__badge--wish">{{ wishlistCount() }}</span>
            }
          </a>

          <a routerLink="/cart" class="navbar__icon-link" title="Cart">
            🛒
            @if (cartCount() > 0) {
              <span class="navbar__badge">{{ cartCount() }}</span>
            }
          </a>

          <a routerLink="/settings" class="navbar__icon-link" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </a>

          <button
            type="button"
            class="navbar__theme-toggle"
            (click)="theme.toggle()"
            [title]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (theme.isDark()) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>

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
    .navbar { background: var(--bg); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
    .navbar__inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; gap: 2rem; height: 64px; }
    .navbar__logo { font-size: 1.25rem; font-weight: 800; color: var(--primary); text-decoration: none; margin-right: auto; }
    .navbar__links { display: flex; gap: 1.5rem; }
    .navbar__link { text-decoration: none; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; padding-bottom: 2px; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
    .navbar__link:hover, .navbar__link--active { color: var(--primary); border-bottom-color: var(--primary); }
    .navbar__actions { display: flex; align-items: center; gap: 1rem; }
    .navbar__icon-link { position: relative; font-size: 1.4rem; text-decoration: none; display: inline-flex; color: var(--text-muted); transition: color 0.2s; }
    .navbar__icon-link:hover { color: var(--primary); }
    .navbar__badge { position: absolute; top: -6px; right: -8px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 9999px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
    .navbar__badge--wish { background: #ef4444; }
    .navbar__theme-toggle { background: none; border: none; cursor: pointer; padding: 0.4rem; color: var(--text-muted); border-radius: 0.4rem; display: flex; align-items: center; transition: background 0.2s, color 0.2s; }
    .navbar__theme-toggle:hover { background: var(--bg-tertiary); color: var(--text); }
    .navbar__user { display: flex; align-items: center; gap: 0.5rem; }
    .navbar__avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
    .navbar__username { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .btn { padding: 0.4rem 1rem; border-radius: 0.4rem; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: background 0.2s; }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { background: var(--primary-hover); }
    .btn--ghost { background: transparent; color: var(--text-muted); }
    .btn--ghost:hover { background: var(--bg-tertiary); color: var(--text-secondary); }
  `]
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cartCount = inject(CartService).itemCount;
  protected readonly wishlistCount = inject(WishlistService).count;
  protected readonly theme = inject(ThemeService);
}
