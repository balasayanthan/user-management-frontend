import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult, User, CreateUser, UpdateUser } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/users`;

  list(opts: { page?: number; pageSize?: number; groupId?: string; search?: string; sortBy?: string; sortDir?: 'asc'|'desc' } = {}) {
    let params = new HttpParams()
      .set('page', (opts.page ?? 1))
      .set('pageSize', (opts.pageSize ?? 20))
      .set('sortBy', opts.sortBy ?? 'LastName')
      .set('sortDir', opts.sortDir ?? 'asc');
    if (opts.groupId) params = params.set('groupId', opts.groupId);
    if (opts.search)  params = params.set('search', opts.search);
    return this.http.get<PagedResult<User>>(this.base, { params });
  }

  get(id: string) { return this.http.get<User>(`${this.base}/${id}`); }
  create(dto: CreateUser) { return this.http.post<string>(this.base, dto); }
  update(id: string, dto: UpdateUser) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  delete(id: string) { return this.http.delete<void>(`${this.base}/${id}`); }
}
