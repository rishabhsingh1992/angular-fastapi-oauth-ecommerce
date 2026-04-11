import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthUser } from '../models/product.model';

interface AuthMeResponse {
  id: number;
  email: string;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
}

interface AuthTokenResponse {
  token: string;
  user: AuthMeResponse;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _user = signal<AuthUser | null>(this.loadUser());

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  loginWithGoogle(): void {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    window.location.href = `${environment.apiBaseUrl}/auth/google?redirect_uri=${redirectUri}`;
  }

  async loginWithEmailPassword(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.http.post<AuthTokenResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password }));
    this.applyAuthResponse(response);
  }

  async registerWithEmailPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ): Promise<void> {
    const response = await firstValueFrom(this.http.post<AuthTokenResponse>(`${environment.apiBaseUrl}/auth/register`, {
      email,
      password,
      full_name: `${firstName} ${lastName}`.trim(),
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber
    }));
    this.applyAuthResponse(response);
  }

  async handleOAuthCallback(params: URLSearchParams): Promise<void> {
    const token = params.get('token');

    const user: AuthUser = {
      id: params.get('id') ?? '1',
      email: params.get('email') ?? 'demo@example.com',
      name: params.get('name') ?? 'Demo User',
      avatarUrl: params.get('avatar_url') ?? this.avatarFor(params.get('name') ?? 'Demo User')
    };

    this._user.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));

    if (token) {
      localStorage.setItem('auth_token', token);
    }

    await this.refreshCurrentUser();
  }

  async refreshCurrentUser(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    try {
      const me = await firstValueFrom(this.http.get<AuthMeResponse>(`${environment.apiBaseUrl}/auth/me?token=${token}`));
      const current = this._user();
      const user: AuthUser = {
        id: String(me.id),
        email: me.email,
        name: me.full_name ?? current?.name ?? 'User',
        avatarUrl: current?.avatarUrl ?? this.avatarFor(me.full_name ?? me.email)
      };
      this._user.set(user);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch {
      this.logout();
    }
  }

  logout(): void {
    const token = localStorage.getItem('auth_token');
    this.http.post(`${environment.apiBaseUrl}/auth/logout`, {}, { params: token ? { token } : {} }).subscribe({ error: () => undefined });
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this._user.set(null);
  }

  private applyAuthResponse(response: AuthTokenResponse): void {
    localStorage.setItem('auth_token', response.token);
    const user: AuthUser = {
      id: String(response.user.id),
      email: response.user.email,
      name: response.user.full_name ?? response.user.email,
      avatarUrl: this.avatarFor(response.user.full_name ?? response.user.email)
    };
    this._user.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private avatarFor(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
