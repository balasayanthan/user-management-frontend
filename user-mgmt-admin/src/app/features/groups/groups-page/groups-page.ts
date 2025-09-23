import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsService } from '../../../core/services/groups.service';
import { Group } from '../../../core/models';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-groups-page',
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './groups-page.html',
  styleUrls: ['./groups-page.scss']
})
export class GroupsPage {
  private groups = inject(GroupsService);
  private snack = inject(MatSnackBar);

  displayed = ['groupName'];
  rows = signal<Group[]>([]);
  nameCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] });

  constructor(){ this.refresh(); }

  create(){
    this.groups.create({ groupName: this.nameCtrl.value }).subscribe(() => {
      this.snack.open('Group created','Close',{duration:2000});
      this.nameCtrl.setValue('');
      this.refresh();
    });
  }

  private refresh(){
    this.groups.list(1, 100).subscribe(res => this.rows.set(res.items));
  }
}
