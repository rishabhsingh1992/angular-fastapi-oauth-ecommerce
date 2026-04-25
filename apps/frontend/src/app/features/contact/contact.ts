import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="contact">

      <header class="contact__header">
        <h1 class="contact__title">Contact Us</h1>
        <p class="contact__subtitle">We'd love to hear from you. Send us a message and we'll get back to you within 24 hours.</p>
      </header>

      <div class="contact__layout">

        <!-- Form / Success -->
        <section class="contact__form-card" aria-label="Send a message">
          @if (submitted()) {
            <div class="contact__success">
              <span class="contact__success-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <h2 class="contact__success-title">Message sent!</h2>
              <p class="contact__success-body">Thanks for reaching out. Our team will reply to <strong>{{ submittedEmail() }}</strong> shortly.</p>
              <button type="button" class="contact__btn contact__btn--primary" (click)="reset()">Send another message</button>
            </div>
          } @else {
            <h2 class="contact__form-title">Send a Message</h2>
            <form [formGroup]="form" (ngSubmit)="submit()" class="contact__form" novalidate>

              <div class="contact__row">
                <div class="form-group">
                  <label for="name">Full Name</label>
                  <input id="name" type="text" formControlName="name" placeholder="Jane Doe" autocomplete="name" />
                  @if (form.get('name')?.invalid && form.get('name')?.touched) {
                    <span class="form-error">Please enter your name.</span>
                  }
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input id="email" type="email" formControlName="email" placeholder="jane@example.com" autocomplete="email" />
                  @if (form.get('email')?.invalid && form.get('email')?.touched) {
                    <span class="form-error">Please enter a valid email.</span>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" formControlName="subject">
                  <option value="" disabled>Select a topic…</option>
                  <option value="general">General Enquiry</option>
                  <option value="order">Order Support</option>
                  <option value="returns">Returns &amp; Refunds</option>
                  <option value="technical">Technical Issue</option>
                  <option value="partnership">Partnership</option>
                </select>
                @if (form.get('subject')?.invalid && form.get('subject')?.touched) {
                  <span class="form-error">Please select a subject.</span>
                }
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" formControlName="message" rows="5" placeholder="Describe your question or issue…"></textarea>
                @if (form.get('message')?.invalid && form.get('message')?.touched) {
                  <span class="form-error">Please enter a message (at least 10 characters).</span>
                }
              </div>

              <button type="submit" class="contact__btn contact__btn--primary contact__btn--block" [disabled]="submitting()">
                {{ submitting() ? 'Sending…' : 'Send Message' }}
              </button>

            </form>
          }
        </section>

        <!-- Info sidebar -->
        <aside class="contact__info" aria-label="Contact information">
          <div class="contact__info-card">
            <span class="contact__info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <div>
              <p class="contact__info-label">Email us</p>
              <a href="mailto:support@shopfast.com" class="contact__info-value">support@shopfast.com</a>
            </div>
          </div>

          <div class="contact__info-card">
            <span class="contact__info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.49 6.49l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <div>
              <p class="contact__info-label">Call us</p>
              <a href="tel:+18001234567" class="contact__info-value">+1 (800) 123-4567</a>
            </div>
          </div>

          <div class="contact__info-card">
            <span class="contact__info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <div>
              <p class="contact__info-label">Visit us</p>
              <p class="contact__info-value">123 Commerce St<br />New York, NY 10001</p>
            </div>
          </div>

          <div class="contact__info-card">
            <span class="contact__info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <div>
              <p class="contact__info-label">Business hours</p>
              <p class="contact__info-value">Mon – Fri, 9 am – 6 pm EST</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  `,
  styles: [`
    .contact {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3rem;
    }

    /* Header */
    .contact__header { margin-bottom: 2.5rem; }
    .contact__title { font-size: 1.75rem; font-weight: 700; color: var(--text); margin: 0; }
    .contact__subtitle { font-size: 0.95rem; color: var(--text-muted); margin: 0.4rem 0 0; max-width: 55ch; line-height: 1.6; }

    /* Two-column layout */
    .contact__layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .contact__layout { grid-template-columns: 1fr; }
    }

    /* Form card */
    .contact__form-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.875rem;
      padding: 2rem;
    }

    .contact__form-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 1.5rem;
    }

    .contact__form { display: flex; flex-direction: column; gap: 1.1rem; }

    .contact__row { display: flex; gap: 1rem; }
    @media (max-width: 540px) { .contact__row { flex-direction: column; } }

    /* Shared form primitives */
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--border-input);
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-ring);
    }

    .form-error { font-size: 0.75rem; color: #ef4444; }

    /* Buttons */
    .contact__btn {
      padding: 0.6rem 1.25rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s, opacity 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .contact__btn--primary { background: var(--primary); color: #fff; }
    .contact__btn--primary:hover:not(:disabled) { background: var(--primary-hover); }
    .contact__btn--primary:disabled { opacity: 0.55; cursor: not-allowed; }
    .contact__btn--block { width: 100%; }

    /* Success state */
    .contact__success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5rem 1rem;
      gap: 0.75rem;
    }

    .contact__success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #dcfce7;
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }

    .contact__success-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text);
      margin: 0;
    }

    .contact__success-body {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0;
      max-width: 36ch;
      line-height: 1.6;
    }

    /* Info sidebar */
    .contact__info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact__info-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.1rem 1.25rem;
    }

    .contact__info-icon {
      width: 40px;
      height: 40px;
      border-radius: 0.5rem;
      background: var(--primary-subtle);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .contact__info-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 0.25rem;
    }

    .contact__info-value {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      text-decoration: none;
      line-height: 1.5;
      margin: 0;
      display: block;
    }

    a.contact__info-value:hover { color: var(--primary); }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submittedEmail = signal('');

  protected readonly form = this.fb.group({
    name:    ['', Validators.required],
    email:   ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.submittedEmail.set(this.form.value.email ?? '');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.submitting.set(false);
    this.submitted.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.submittedEmail.set('');
  }
}
