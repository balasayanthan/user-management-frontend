import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  extensions?: Record<string, unknown>;
  errors?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) { }

  success(msg: string) { this.snack.open(msg, 'OK', { duration: 2000 }); }
  info(msg: string) { this.snack.open(msg, 'OK', { duration: 3500 }); }

  problem(pd: ProblemDetails | any) {
    const status = pd?.status ?? 0;

    if (status >= 500 || status === 0) {
      this.snack.open('Something went wrong. Please try again.', 'Close', { duration: 5000 });
      return;
    }

    const msg =
      pd?.title?.trim() ||
      pd?.detail?.trim() ||
      'Request failed';

    this.snack.open(msg, 'Close', {
      duration: 5000,
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top',     // 'top' | 'bottom'
      panelClass: ['snack-info']   // custom style class (see below)
    });
  }
}
