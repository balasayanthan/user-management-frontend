import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
  <mat-sidenav-container class="container">
    <mat-sidenav mode="side" opened class="sidenav">
      <div class="brand">UserMgmt</div>
      <mat-nav-list>
        <a mat-list-item routerLink="/users" routerLinkActive="active"><mat-icon>people</mat-icon>&nbsp;Users</a>
        <a mat-list-item routerLink="/groups" routerLinkActive="active"><mat-icon>group_work</mat-icon>&nbsp;Groups</a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar color="primary">
        <span>User Management Admin</span>
        <span class="spacer"></span>
        <a mat-button routerLink="/reports" routerLinkActive="active">Reports</a>
      </mat-toolbar>
      <main class="content">
        <router-outlet />
      </main>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: [`
    .container { height: 100vh; }
    .sidenav { width: 240px; padding-top: 8px; }
    .brand { font-weight: 700; padding: 16px; }
    .content { padding: 16px; }
    .spacer { flex: 1 1 auto; }
    a.active { font-weight: 600; }
  `]
})
export class ShellComponent { }
