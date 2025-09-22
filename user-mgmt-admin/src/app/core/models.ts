export interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalCount: number; }

export interface Group { id: string; groupName: string; }

export interface User {
  id: string;
  firstName: string; lastName: string; email: string;
  userGroupId: string; groupName: string; attachedCustomerId?: number | null;
}

export interface CreateUser {
  firstName: string; lastName: string; email: string; userGroupId: string; attachedCustomerId?: number | null;
}

export interface UpdateUser extends CreateUser {}

export interface AccessRule { id: string; userGroupId: string; ruleName: string; permission: boolean; }

export interface CreateAccessRule { userGroupId: string; ruleName: string; permission: boolean; }
