export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  organizationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  assignmentScope?: 'organization' | 'class';
  createdAt: string;
  lastLoginAt?: string;
}

export type UserPublic = Omit<User, 'password'>;

export interface UserCreatePayload {
  organizationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  assignmentScope?: 'organization' | 'class';
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  assignmentScope?: 'organization' | 'class';
}
