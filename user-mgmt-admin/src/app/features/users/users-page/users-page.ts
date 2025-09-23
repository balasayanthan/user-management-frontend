import { Component,effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models';
import { UserDialog } from '../user-dialog/user-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-users-page',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './users-page.html',
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
