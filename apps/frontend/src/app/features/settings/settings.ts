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
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly notifPrefs = signal<NotifPrefs>(loadNotifPrefs());
  protected readonly privacyPrefs = signal<PrivacyPrefs>(loadPrivacyPrefs());

  protected toggleNotif(key: keyof NotifPrefs): void {
    this.notifPrefs.update(current => {
      const next = { ...current, [key]: !current[key] };
      this.persistPrefs('notif_prefs', next);
      return next;
    });
  }

  protected togglePrivacy(key: keyof PrivacyPrefs): void {
    this.privacyPrefs.update(current => {
      const next = { ...current, [key]: !current[key] };
      this.persistPrefs('privacy_prefs', next);
      return next;
    });
  }

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected onLogout(): void {
    this.auth.logout();
  }

  private persistPrefs(storageKey: 'notif_prefs' | 'privacy_prefs', prefs: NotifPrefs | PrivacyPrefs): void {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  }
}
