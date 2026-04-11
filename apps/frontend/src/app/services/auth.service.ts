import { Injectable, computed, signal } from '@angular/core';
import { AuthUser } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(null);

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  /** Placeholder — will redirect to backend Google OAuth URL. */
  loginWithGoogle(): void {
    // TODO: redirect to GET /api/v1/auth/google
    this._user.set({
      id: 'mock-1',
      email: 'demo@example.com',
      name: 'Demo User',
      avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff'
    });
  }

  logout(): void {
    this._user.set(null);
  }
}
