import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component.js';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', loadComponent: () => import('./features/users/users-page/users-page.js').then(m => m.UsersPage) },
      { path: 'groups', loadComponent: () => import('./features/groups/groups-page/groups-page.js').then(m => m.GroupsPage) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports-page/reports-page.js').then(m=>m.ReportsPage) },
      { path: '**', redirectTo: 'users' }
    ]
  }
];
