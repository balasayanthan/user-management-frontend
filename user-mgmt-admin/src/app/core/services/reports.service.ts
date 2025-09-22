import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/reports`;

  userNamesByPermission(permission: boolean, ruleName?: string) {
    let params = new HttpParams().set('permission', permission);
    if (ruleName) params = params.set('ruleName', ruleName);
    return this.http.get<string[]>(`${this.base}/user-names-by-permission`, { params });
  }
}
