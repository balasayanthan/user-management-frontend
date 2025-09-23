import { FormGroup } from '@angular/forms';
import { ProblemDetails } from './toast.service';

export function applyProblemDetailsToForm(form: FormGroup, pd?: ProblemDetails) {
  if (!pd?.errors) return;
  Object.entries(pd.errors).forEach(([key, messages]) => {
    const ctrl = form.get(key);
    if (ctrl) {
      ctrl.setErrors({ ...(ctrl.errors ?? {}), server: messages?.[0] ?? 'Invalid' });
      ctrl.markAsTouched();
    }
  });
}
