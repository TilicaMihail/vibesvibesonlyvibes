import { UserPublic } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserPublic;
}

export interface RegisterRequest {
  organizationName: string;
  organizationSlug: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
}

export interface RegisterResponse {
  token: string;
  user: UserPublic;
  organizationId: string;
}

export interface TokenPayload {
  userId: string;
  role: string;
  orgId: string;
  exp: number;
}

export interface AuthState {
  user: UserPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
