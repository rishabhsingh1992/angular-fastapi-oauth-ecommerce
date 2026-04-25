import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { FooterComponent } from './shared/footer/footer';
import { NavbarComponent } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
  `]
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly _theme = inject(ThemeService);

  constructor() {
    void this.auth.refreshCurrentUser();
  }
}
