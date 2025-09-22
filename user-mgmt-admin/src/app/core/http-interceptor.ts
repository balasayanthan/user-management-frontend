import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  const cloned = req.clone({ setHeaders: { 'X-Requested-With': 'XMLHttpRequest' } });

  return next(cloned).pipe(
    catchError((err: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = err as any;
      const msg = e?.error?.error ?? e?.message ?? 'Request failed';
      snack.open(msg, 'Close', { duration: 4000 });
      return throwError(() => e);
    })
  );
};
