import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login">
      <div class="login__card">
        <div class="login__logo">ShopFast</div>
        <h1 class="login__title">Sign in to your account</h1>
        <p class="login__subtitle">Access your orders, cart, and personalized experience.</p>

        <button type="button" class="login__google-btn" (click)="signIn()">
          <svg class="login__google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p class="login__demo-note">
          Demo mode: clicking above sets a mock user without a real OAuth redirect.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; background: #f9fafb; }
    .login__card { background: #fff; border: 1px solid #e5e7eb; border-radius: 1rem; padding: 2.5rem 2rem; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .login__logo { font-size: 1.5rem; font-weight: 800; color: #6366f1; margin-bottom: 1.5rem; }
    .login__title { font-size: 1.25rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    .login__subtitle { font-size: 0.9rem; color: #6b7280; margin: 0 0 2rem; }
    .login__google-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #fff; cursor: pointer; font-size: 0.95rem; font-weight: 500; color: #374151; transition: background 0.2s, border-color 0.2s; }
    .login__google-btn:hover { background: #f9fafb; border-color: #9ca3af; }
    .login__google-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .login__demo-note { margin-top: 1.25rem; font-size: 0.75rem; color: #9ca3af; }
  `]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected async signIn(): Promise<void> {
    this.auth.loginWithGoogle();
    await this.router.navigate(['/']);
  }
}
