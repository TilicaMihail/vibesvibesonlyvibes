import { UserPublic } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserPublic;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  country: string;
  city: string;
  organizationType: string;
  address?: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: UserPublic;
}

export interface RefreshResponse {
  accessToken: string;
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
