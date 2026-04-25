import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MOCK_CATEGORIES } from '../../mock/mock-data';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">

        <div class="footer__brand">
          <a routerLink="/" class="footer__logo">ShopFast</a>
          <p class="footer__tagline">Your one-stop shop for everything you need, delivered fast.</p>
        </div>

        <div class="footer__col">
          <h3 class="footer__heading">Quick Links</h3>
          <nav class="footer__links" aria-label="Footer navigation">
            <a routerLink="/" class="footer__link">Products</a>
            <a routerLink="/orders" class="footer__link">Orders</a>
            <a routerLink="/cart" class="footer__link">Cart</a>
            <a routerLink="/wishlist" class="footer__link">Wishlist</a>
            <a routerLink="/settings" class="footer__link">Settings</a>
            <a routerLink="/contact" class="footer__link">Contact Us</a>
          </nav>
        </div>

        <div class="footer__col">
          <h3 class="footer__heading">Categories</h3>
          <nav class="footer__links" aria-label="Browse categories">
            @for (category of categories; track category) {
              <a routerLink="/" class="footer__link footer__link--category">{{ category }}</a>
            }
          </nav>
        </div>

      </div>

      <div class="footer__bottom">
        <p class="footer__copy">&copy; {{ year }} ShopFast. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg);
      border-top: 1px solid var(--border);
    }

    .footer__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem 2rem;
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 2rem;
    }

    .footer__logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    .footer__tagline {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 28ch;
      margin: 0;
    }

    .footer__heading {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 1rem;
    }

    .footer__links {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .footer__link {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer__link:hover { color: var(--primary); }

    .footer__link--category { text-transform: capitalize; }

    .footer__bottom {
      border-top: 1px solid var(--border);
      padding: 1rem 1.5rem;
      text-align: center;
    }

    .footer__copy {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0;
    }

    @media (max-width: 640px) {
      .footer__inner {
        grid-template-columns: 1fr 1fr;
      }
      .footer__brand {
        grid-column: 1 / -1;
      }
    }
  `]
})
export class FooterComponent {
  protected readonly categories = MOCK_CATEGORIES;
  protected readonly year = new Date().getFullYear();
}
