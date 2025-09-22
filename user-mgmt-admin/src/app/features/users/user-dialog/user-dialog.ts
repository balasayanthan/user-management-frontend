import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../core/services/users.service';
import { GroupsService } from '../../../core/services/groups.service';
import { Group, CreateUser, User } from '../../../core/models';
import { CommonModule } from '@angular/common';

type DialogData = { mode: 'create' } | { mode: 'edit', row: User };

@Component({
  standalone: true,
  selector: 'app-user-dialog',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
  <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create User' : 'Edit User' }}</h2>
  <div mat-dialog-content [formGroup]="form">
    <mat-form-field appearance="outline"><mat-label>First Name</mat-label>
      <input matInput formControlName="firstName" />
    </mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Last Name</mat-label>
      <input matInput formControlName="lastName" />
    </mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Email</mat-label>
      <input matInput type="email" formControlName="email" />
    </mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Group</mat-label>
      <mat-select formControlName="userGroupId">
        <mat-option *ngFor="let g of groups" [value]="g.id">{{g.groupName}}</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field appearance="outline"><mat-label>Attached Customer Id</mat-label>
      <input matInput type="number" formControlName="attachedCustomerId" />
    </mat-form-field>
  </div>
  <div mat-dialog-actions align="end">
    <button mat-button (click)="close()">Cancel</button>
    <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Create' : 'Save' }}</button>
  </div>
  `,
  styles:[`mat-form-field{width:100%;display:block;margin-bottom:12px;}`]
})
export class UserDialog implements OnInit {
  private fb = inject(FormBuilder);
  private users = inject(UsersService);
  private groupsSvc = inject(GroupsService);
  groups: Group[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private ref: MatDialogRef<UserDialog>) {}

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
    userGroupId: ['', Validators.required],
    attachedCustomerId: [null as number | null],
  });

  ngOnInit(): void {
    this.groupsSvc.list(1, 100).subscribe(res => this.groups = res.items);
    if (this.isEdit()) {
      const r = this.data.row;
      this.form.patchValue({
        firstName: r.firstName, lastName: r.lastName, email: r.email,
        userGroupId: r.userGroupId, attachedCustomerId: r.attachedCustomerId ?? null
      });
    }
  }
  isEdit(): this is { data: { mode: 'edit', row: User } } { return this.data.mode === 'edit'; }

  save(){
    if (this.form.invalid) return;
    const dto = this.form.value as unknown as CreateUser;
    if (this.data.mode === 'create') {
      this.users.create(dto).subscribe(() => this.ref.close(true));
    } else {
      this.users.update(this.data.row.id, dto).subscribe(() => this.ref.close(true));
    }
  }
  close(){ this.ref.close(false); }
}
