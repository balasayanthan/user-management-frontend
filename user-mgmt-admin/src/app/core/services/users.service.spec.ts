import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UsersService } from './users.service';
import { environment } from '../../../environments/environment';

describe('UsersService', () => {
  let svc: UsersService, http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService, provideHttpClient(), provideHttpClientTesting()]
    });
    svc = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  it('lists users with defaults', () => {
    svc.list().subscribe(res => {
      expect(res.page).toBe(1);
      expect(res.items.length).toBe(1);
    });
    const req = http.expectOne(`${environment.apiBase}/users?page=1&pageSize=20&sortBy=LastName&sortDir=asc`);
    expect(req.request.method).toBe('GET');
    req.flush({ items: [{ id:'x', firstName:'A', lastName:'B', email:'a@b.com', userGroupId:'g', groupName:'Admins' }], page:1, pageSize:20, totalCount:1 });
    http.verify();
  });
});
