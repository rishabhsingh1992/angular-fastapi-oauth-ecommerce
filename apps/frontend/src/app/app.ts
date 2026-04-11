import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { NavbarComponent } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    main { min-height: calc(100vh - 64px); }
  `]
})
export class App {
  private readonly auth = inject(AuthService);

  constructor() {
    void this.auth.refreshCurrentUser();
  }
}
