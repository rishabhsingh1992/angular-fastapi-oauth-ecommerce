import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

interface NotifPrefs {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotionalOffers: boolean;
}

interface PrivacyPrefs {
  shareUsageData: boolean;
  personalisedAds: boolean;
}

function loadNotifPrefs(): NotifPrefs {
  try {
    const raw = localStorage.getItem('notif_prefs');
    if (raw) return JSON.parse(raw) as NotifPrefs;
  } catch { /* ignore */ }
  return { emailNotifications: true, orderUpdates: true, promotionalOffers: false };
}

function loadPrivacyPrefs(): PrivacyPrefs {
  try {
    const raw = localStorage.getItem('privacy_prefs');
    if (raw) return JSON.parse(raw) as PrivacyPrefs;
  } catch { /* ignore */ }
  return { shareUsageData: false, personalisedAds: false };
}

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="settings">
      <header class="settings__header">
        <h1 class="settings__title">Settings</h1>
        <p class="settings__subtitle">Manage your account and preferences</p>
      </header>

      <!-- Profile -->
      <section class="settings__card" aria-labelledby="profile-heading">
        <h2 id="profile-heading" class="settings__card-heading">Profile</h2>
        @if (auth.isLoggedIn()) {
          <div class="settings__profile">
            <img [src]="auth.currentUser()!.avatarUrl" [alt]="auth.currentUser()!.name" class="settings__avatar" width="64" height="64" />
            <div>
              <p class="settings__profile-name">{{ auth.currentUser()!.name }}</p>
              <p class="settings__profile-email">{{ auth.currentUser()!.email }}</p>
            </div>
          </div>
        } @else {
          <div class="settings__row">
            <div class="settings__row-info">
              <span class="settings__row-label">Not signed in</span>
              <span class="settings__row-desc">Sign in to access your profile and order history</span>
            </div>
            <a routerLink="/login" class="settings__btn settings__btn--primary">Sign In</a>
          </div>
        }
      </section>

      <!-- Appearance -->
      <section class="settings__card" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" class="settings__card-heading">Appearance</h2>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Dark Mode</span>
            <span class="settings__row-desc">Switch between light and dark themes</span>
          </div>
          <label class="settings__toggle" [title]="theme.isDark() ? 'Switch to light' : 'Switch to dark'">
            <input type="checkbox" [checked]="theme.isDark()" (change)="theme.toggle()" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
      </section>

      <!-- Notifications -->
      <section class="settings__card" aria-labelledby="notif-heading">
        <h2 id="notif-heading" class="settings__card-heading">Notifications</h2>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Email Notifications</span>
            <span class="settings__row-desc">Receive important account updates via email</span>
          </div>
          <label class="settings__toggle">
            <input type="checkbox" [checked]="notifPrefs().emailNotifications" (change)="toggleNotif('emailNotifications')" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Order Updates</span>
            <span class="settings__row-desc">Get notified when your order status changes</span>
          </div>
          <label class="settings__toggle">
            <input type="checkbox" [checked]="notifPrefs().orderUpdates" (change)="toggleNotif('orderUpdates')" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Promotional Offers</span>
            <span class="settings__row-desc">Deals, discounts and product recommendations</span>
          </div>
          <label class="settings__toggle">
            <input type="checkbox" [checked]="notifPrefs().promotionalOffers" (change)="toggleNotif('promotionalOffers')" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
      </section>

      <!-- Privacy -->
      <section class="settings__card" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" class="settings__card-heading">Privacy</h2>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Share Usage Data</span>
            <span class="settings__row-desc">Help us improve by sharing anonymous analytics</span>
          </div>
          <label class="settings__toggle">
            <input type="checkbox" [checked]="privacyPrefs().shareUsageData" (change)="togglePrivacy('shareUsageData')" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
        <div class="settings__row">
          <div class="settings__row-info">
            <span class="settings__row-label">Personalised Ads</span>
            <span class="settings__row-desc">See ads tailored to your browsing activity</span>
          </div>
          <label class="settings__toggle">
            <input type="checkbox" [checked]="privacyPrefs().personalisedAds" (change)="togglePrivacy('personalisedAds')" class="settings__toggle-input" />
            <span class="settings__toggle-track"></span>
          </label>
        </div>
      </section>

      <!-- Account / danger zone -->
      @if (auth.isLoggedIn()) {
        <section class="settings__card" aria-labelledby="account-heading">
          <h2 id="account-heading" class="settings__card-heading">Account</h2>
          <div class="settings__row">
            <div class="settings__row-info">
              <span class="settings__row-label">Sign Out</span>
              <span class="settings__row-desc">Log out of your account on this device</span>
            </div>
            <button type="button" class="settings__btn settings__btn--danger-outline" (click)="auth.logout()">
              Log out
            </button>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .settings {
      max-width: 640px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3rem;
    }

    .settings__header { margin-bottom: 2rem; }
    .settings__title { font-size: 1.75rem; font-weight: 700; color: var(--text); margin: 0; }
    .settings__subtitle { font-size: 0.9rem; color: var(--text-muted); margin: 0.3rem 0 0; }

    /* Card */
    .settings__card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.875rem;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .settings__card-heading {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin: 0 0 1.25rem;
    }

    /* Row */
    .settings__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 0.75rem 0;
    }

    .settings__card > .settings__row:first-of-type { padding-top: 0; }
    .settings__card > .settings__row:last-of-type  { padding-bottom: 0; }

    .settings__row + .settings__row {
      border-top: 1px solid var(--border);
    }

    .settings__row-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 0;
    }

    .settings__row-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
    }

    .settings__row-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Profile */
    .settings__profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .settings__avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid var(--border);
    }

    .settings__profile-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      margin: 0;
    }

    .settings__profile-email {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0.15rem 0 0;
    }

    /* Toggle switch */
    .settings__toggle {
      position: relative;
      display: inline-flex;
      cursor: pointer;
      flex-shrink: 0;
    }

    .settings__toggle-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .settings__toggle-track {
      width: 44px;
      height: 24px;
      border-radius: 9999px;
      background: var(--border-input);
      transition: background 0.2s;
      position: relative;
    }

    .settings__toggle-track::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }

    .settings__toggle-input:checked + .settings__toggle-track {
      background: var(--primary);
    }

    .settings__toggle-input:checked + .settings__toggle-track::after {
      transform: translateX(20px);
    }

    .settings__toggle-input:focus-visible + .settings__toggle-track {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* Buttons */
    .settings__btn {
      padding: 0.45rem 1rem;
      border-radius: 0.45rem;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }

    .settings__btn--primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .settings__btn--primary:hover { background: var(--primary-hover); border-color: var(--primary-hover); }

    .settings__btn--danger-outline {
      background: transparent;
      color: #ef4444;
      border-color: #ef4444;
    }
    .settings__btn--danger-outline:hover { background: #fef2f2; color: #dc2626; border-color: #dc2626; }
  `]
})
export class SettingsComponent {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly notifPrefs = signal<NotifPrefs>(loadNotifPrefs());
  protected readonly privacyPrefs = signal<PrivacyPrefs>(loadPrivacyPrefs());

  protected toggleNotif(key: keyof NotifPrefs): void {
    this.notifPrefs.update(p => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem('notif_prefs', JSON.stringify(next));
      return next;
    });
  }

  protected togglePrivacy(key: keyof PrivacyPrefs): void {
    this.privacyPrefs.update(p => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem('privacy_prefs', JSON.stringify(next));
      return next;
    });
  }
}
