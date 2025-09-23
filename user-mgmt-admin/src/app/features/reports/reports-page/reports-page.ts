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
  templateUrl: './reports-page.html',
  styleUrls: ['./reports-page.scss']
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
