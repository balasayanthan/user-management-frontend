import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AccessRule, CreateAccessRule } from '../models';

@Injectable({ providedIn: 'root' })
export class RulesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/groups`;

  list(groupId: string) {
    return this.http.get<AccessRule[]>(`${this.base}/${groupId}/rules`);
  }
  create(groupId: string, dto: Omit<CreateAccessRule, 'userGroupId'>) {
    return this.http.post<string>(`${this.base}/${groupId}/rules`, dto);
  }
  delete(groupId: string, ruleId: string) {
    return this.http.delete<void>(`${this.base}/${groupId}/rules/${ruleId}`);
  }
}
