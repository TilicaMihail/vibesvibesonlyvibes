export type UserRole = 'admin' | 'teacher' | 'student';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING';

export interface UserPublic {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface UserCreatePayload {
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: 'TEACHER' | 'STUDENT';
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserStatusUpdatePayload {
  status: UserStatus;
}
