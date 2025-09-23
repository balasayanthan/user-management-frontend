// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';

// export const httpInterceptor: HttpInterceptorFn = (req, next) => {
//   const snack = inject(MatSnackBar);
//   const cloned = req.clone({ setHeaders: { 'X-Requested-With': 'XMLHttpRequest' } });

//   return next(cloned).pipe(
//     catchError((err: unknown) => {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const e = err as any;
//       const msg = e?.error?.error ?? e?.message ?? 'Request failed';
//       snack.open(msg, 'Close', { duration: 4000 });
//       return throwError(() => e);
//     })
//   );
// };

import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const snack = inject(MatSnackBar);

  // Clone with default headers
  let headers: Record<string, string> = { 'X-Requested-With': 'XMLHttpRequest' };

  // Attach Authorization only if configured and targeting our API
  const isApiCall =
    req.url.startsWith(environment.apiBase) || // direct base
    req.url.startsWith('/api/');               // when using dev proxy

  if (isApiCall && environment.auth?.enabled && environment.auth.token) {
    headers['Authorization'] = `Bearer ${environment.auth.token}`;
  }

  const cloned = req.clone({ setHeaders: headers });

  return next(cloned).pipe(
    catchError((err: unknown) => {
      const e = err as any;
      const msg = e?.error?.title || e?.error?.error || e?.message || 'Request failed';
      snack.open(msg, 'Close', { duration: 4000 });
      return throwError(() => e);
    })
  );
};

