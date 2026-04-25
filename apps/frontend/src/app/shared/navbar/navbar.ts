import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly cartCount = inject(CartService).itemCount;
  protected readonly wishlistCount = inject(WishlistService).count;
  protected readonly theme = inject(ThemeService);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly currentUser = this.auth.currentUser;
  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly hasAnyBadges = computed(() => this.cartCount() > 0 || this.wishlistCount() > 0);

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update(current => !current);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected async submitSearch(): Promise<void> {
    const query = this.searchQuery().trim();
    await this.router.navigate(['/'], {
      queryParams: query ? { q: query } : {},
    });
    this.closeMobileMenu();
  }

  protected logout(): void {
    this.auth.logout();
    this.closeMobileMenu();
  }
}
