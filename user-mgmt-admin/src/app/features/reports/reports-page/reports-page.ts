import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

const REPORTS_PAGE_IMPORTS = [
  CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSlideToggleModule,
  MatButtonModule
];

@Component({
  standalone: true,
  selector: 'app-reports-page',
  imports: REPORTS_PAGE_IMPORTS,
  template: `
  <div *ngIf="!envAuthEnabled()" class="warn">
    Authorization disabled in environment (Auth.Enabled=false). Reports may return 401.
  </div>
  <div *ngIf="envAuthEnabled() && !envTokenSet()" class="warn">
    Auth enabled but token is empty – set environment.auth.token
  </div>
  <div class="row">
    <mat-slide-toggle [(ngModel)]="permission">Permission = true</mat-slide-toggle>
    <mat-form-field appearance="outline"><mat-label>Rule Name</mat-label>
      <input matInput [(ngModel)]="ruleName" placeholder="e.g., CanViewReports" />
    </mat-form-field>
    <button mat-flat-button color="primary" (click)="run()">Run</button>
  </div>
  <ul>
    <li *ngFor="let n of names()">{{ n }}</li>
  </ul>
  `,
  styles:[`.row{display:flex; gap:12px; align-items:center; margin-bottom:12px;} .warn{ background:#fff3cd; color:#664d03; padding:8px 12px; border:1px solid #ffe69c; border-radius:6px; margin-bottom:12px;}`]
})
export class ReportsPage {
  envAuthEnabled() { return !!environment.auth?.enabled; }
  envTokenSet() { return !!environment.auth?.token; }
  private reports = inject(ReportsService);
  permission = true;
  ruleName = '';
  names = signal<string[]>([]);

  run() {
    const rn = this.ruleName?.trim() || undefined;
    this.reports.userNamesByPermission(this.permission, rn)
      .subscribe(res => this.names.set(res));
  }
}
