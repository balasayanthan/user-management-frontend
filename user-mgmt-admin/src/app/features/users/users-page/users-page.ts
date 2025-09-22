import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../../core/services/users.service';
import { GroupsService } from '../../../core/services/groups.service';
import { User } from '../../../core/models';
import { UserDialog } from '../user-dialog/user-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-users-page',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  template: `
  <div class="header">
    <mat-form-field appearance="outline">
      <mat-label>Search</mat-label>
      <input matInput [formControl]="searchCtrl" placeholder="name or email" />
    </mat-form-field>
    <span class="spacer"></span>
    <button mat-flat-button color="primary" (click)="openCreate()">
      <mat-icon>add</mat-icon> New User
    </button>
  </div>

  <table mat-table [dataSource]="rows()">
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Name</th>
      <td mat-cell *matCellDef="let r">{{r.firstName}} {{r.lastName}}</td>
    </ng-container>

    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef>Email</th>
      <td mat-cell *matCellDef="let r">{{r.email}}</td>
    </ng-container>

    <ng-container matColumnDef="group">
      <th mat-header-cell *matHeaderCellDef>Group</th>
      <td mat-cell *matCellDef="let r">{{r.groupName}}</td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let r">
        <button mat-icon-button (click)="openEdit(r)"><mat-icon>edit</mat-icon></button>
        <button mat-icon-button color="warn" (click)="remove(r)"><mat-icon>delete</mat-icon></button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayed"></tr>
    <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
  </table>

  <mat-paginator [length]="total()" [pageSize]="pageSize()" [pageIndex]="page()-1"
                 (page)="pageChange($event)"></mat-paginator>
  `,
  styles: [`
    .header{ display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .spacer{ flex:1 1 auto; }
    table{ width:100%; }
  `]
})
export class UsersPage {
  private users = inject(UsersService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayed = ['name','email','group','actions'];

  // state (signals)
  page = signal(1);
  pageSize = signal(10);
  total = signal(0);
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  rows = signal<User[]>([]);

  constructor() {
    effect(() => {
      const s = this.searchCtrl.value?.trim();
      this.users.list({ page: this.page(), pageSize: this.pageSize(), search: s || undefined })
        .subscribe(res => { this.rows.set(res.items); this.total.set(res.totalCount); });
    });
  }

  pageChange(e: PageEvent) {
    this.page.set(e.pageIndex + 1);
    this.pageSize.set(e.pageSize);
  }

  openCreate() {
    const ref = this.dialog.open(UserDialog, { data: { mode: 'create' }, width: '480px' });
    ref.afterClosed().subscribe(ok => { if (ok) this.refresh(); });
  }
  openEdit(row: User) {
    const ref = this.dialog.open(UserDialog, { data: { mode: 'edit', row }, width: '480px' });
    ref.afterClosed().subscribe(ok => { if (ok) this.refresh(); });
  }
  remove(row: User) {
    this.users.delete(row.id).subscribe(() => { this.snack.open('User deleted', 'Close', { duration: 2000 }); this.refresh(); });
  }
  private refresh(){ const s = this.searchCtrl.value?.trim();
    this.users.list({ page: this.page(), pageSize: this.pageSize(), search: s || undefined })
      .subscribe(res => { this.rows.set(res.items); this.total.set(res.totalCount); });
  }
}
