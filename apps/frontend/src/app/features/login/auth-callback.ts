import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-callback">
      <p>Completing sign in...</p>
    </div>
  `,
  styles: [`.auth-callback { min-height: calc(100vh - 64px); display: grid; place-items: center; color: #4b5563; }`]
})
export class AuthCallbackComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    void this.complete();
  }

  private async complete(): Promise<void> {
    await this.auth.handleOAuthCallback(new URLSearchParams(window.location.search));
    await this.router.navigate(['/']);
  }
}
