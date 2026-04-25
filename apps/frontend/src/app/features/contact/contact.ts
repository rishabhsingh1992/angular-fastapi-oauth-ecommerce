import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submittedEmail = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected readonly nameControl = this.form.controls.name;
  protected readonly emailControl = this.form.controls.email;
  protected readonly subjectControl = this.form.controls.subject;
  protected readonly messageControl = this.form.controls.message;

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.submittedEmail.set(this.emailControl.value);
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
