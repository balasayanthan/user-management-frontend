import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Group, PagedResult } from '../models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/groups`;

  list(page = 1, pageSize = 50) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<PagedResult<Group>>(this.base, { params });
  }
  get(id: string) { return this.http.get<Group>(`${this.base}/${id}`); }
  create(dto: { groupName: string }) { return this.http.post<string>(this.base, dto); }
  update(id: string, dto: { groupName: string }) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  delete(id: string) { return this.http.delete<void>(`${this.base}/${id}`); }
}
