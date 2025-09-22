import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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
  styles:[`.row{display:flex; gap:12px; align-items:center; margin-bottom:12px;}`]
})
export class ReportsPage {
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
