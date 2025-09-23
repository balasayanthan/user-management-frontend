import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService, ProblemDetails } from './toast.service';

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const toast = inject(ToastService);

  // Attach static bearer from env for API calls
  let headers: Record<string, string> = { 'X-Requested-With': 'XMLHttpRequest' };
  const isApi = req.url.startsWith(environment.apiBase) || req.url.startsWith('/api/');
  if (isApi && environment.auth?.enabled && environment.auth.token) {
    headers['Authorization'] = `Bearer ${environment.auth.token}`;
  }
  const cloned = req.clone({ setHeaders: headers });

  return next(cloned).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const pd: ProblemDetails | undefined = err.error && typeof err.error === 'object'
          ? {
              ...err.error,
              extensions: err.error?.extensions ?? err.error?.extension ?? undefined,
              errors: err.error?.errors
            }
          : undefined;

        // 400/422: let components map field errors (we still show a concise toast)
        if (err.status === 400 || err.status === 422) {
          toast.problem(pd ?? { title: 'Validation failed', status: err.status });
        }
        // 401/403: concise, non-technical
        else if (err.status === 401) {
          toast.info('You need to sign in to continue.');
        } else if (err.status === 403) {
          toast.info('You do not have permission to perform this action.');
        }
        // 404: neutral
        else if (err.status === 404) {
          toast.info('Not found.');
        }
        // 429: suggest retry
        else if (err.status === 429) {
          toast.info('Too many requests. Please try again in a moment.');
        }
        // Everything else: generic or ProblemDetails title
        else {
          toast.problem(pd ?? { status: err.status, title: err.message });
        }
      } else {
        // Non-HTTP (network/unknown)
        toast.problem({ status: 0 });
      }
      return throwError(() => err);
    })
  );
};


