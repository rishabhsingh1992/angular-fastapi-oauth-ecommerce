import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="login">
      <div class="login__card">
        <div class="login__logo">ShopFast</div>
        <h1 class="login__title">Sign in to your account</h1>
        <p class="login__subtitle">Use email/password or continue with Google.</p>

        <form class="login__form" (ngSubmit)="signInWithPassword()">
          <input class="login__input" type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
          <input class="login__input" type="text" [(ngModel)]="firstName" name="firstName" placeholder="First name" />
          <input class="login__input" type="text" [(ngModel)]="lastName" name="lastName" placeholder="Last name" />
          <input class="login__input" type="tel" [(ngModel)]="phoneNumber" name="phoneNumber" placeholder="Phone number" />
          <input class="login__input" type="password" [(ngModel)]="password" name="password" placeholder="Password" required minlength="6" />
          <button type="submit" class="btn btn--primary btn--full">Sign In</button>
        </form>

        <button type="button" class="btn btn--ghost btn--full" (click)="register()">Create Account</button>

        <div class="login__divider">or</div>

        <button type="button" class="login__google-btn" (click)="signInWithGoogle()">
          <svg class="login__google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        @if (error()) {
          <p class="login__error">{{ error() }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .login { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; background: var(--bg-secondary); }
    .login__card { background: var(--bg); border: 1px solid var(--border); border-radius: 1rem; padding: 2.5rem 2rem; max-width: 400px; width: 100%; text-align: center; box-shadow: var(--shadow-sm); }
    .login__logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 1.5rem; }
    .login__title { font-size: 1.25rem; font-weight: 700; color: var(--text); margin: 0 0 0.5rem; }
    .login__subtitle { font-size: 0.9rem; color: var(--text-muted); margin: 0 0 1rem; }
    .login__form { display: flex; flex-direction: column; gap: 0.75rem; }
    .login__input { border: 1px solid var(--border-input); border-radius: 0.5rem; padding: 0.65rem 0.75rem; font-size: 0.95rem; }
    .btn { border-radius: 0.5rem; border: 1px solid transparent; padding: 0.65rem 0.75rem; cursor: pointer; font-weight: 600; }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--ghost { background: var(--bg); color: var(--text-secondary); border-color: var(--border-input); margin-top: 0.75rem; }
    .btn--full { width: 100%; }
    .login__divider { margin: 1rem 0; color: var(--text-faint); font-size: 0.8rem; }
    .login__google-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border: 1px solid var(--border-input); border-radius: 0.5rem; background: var(--bg); cursor: pointer; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); }
    .login__google-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .login__error { color: #dc2626; margin-top: 0.75rem; font-size: 0.85rem; }
  `]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected firstName = '';
  protected lastName = '';
  protected phoneNumber = '';
  protected readonly error = signal('');

  protected signInWithGoogle(): void {
    this.auth.loginWithGoogle();
  }

  protected async signInWithPassword(): Promise<void> {
    this.error.set('');
    try {
      await this.auth.loginWithEmailPassword(this.email, this.password);
      await this.router.navigate(['/']);
    } catch {
      this.error.set('Invalid email or password.');
    }
  }

  protected async register(): Promise<void> {
    this.error.set('');
    if (!this.firstName.trim() || !this.lastName.trim() || !this.phoneNumber.trim()) {
      this.error.set('First name, last name, and phone number are required for registration.');
      return;
    }

    try {
      await this.auth.registerWithEmailPassword(
        this.email,
        this.password,
        this.firstName,
        this.lastName,
        this.phoneNumber
      );
      await this.router.navigate(['/']);
    } catch {
      this.error.set('Unable to register. Email may already be in use.');
    }
  }
}
