import { baseApi } from './baseApi';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshResponse } from '@/types';
import type { UserRole } from '@/types/user';

function normalizeRole(backendRole: string): UserRole {
  if (backendRole === 'ORGANIZATION_ADMIN' || backendRole === 'ADMIN') return 'admin';
  if (backendRole === 'TEACHER') return 'teacher';
  return 'student';
}

function normalizeAuthResponse(raw: { accessToken: string; user: Record<string, unknown> }): LoginResponse {
  return {
    accessToken: raw.accessToken,
    user: {
      ...(raw.user as object),
      role: normalizeRole(raw.user.role as string),
    } as LoginResponse['user'],
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (raw: { accessToken: string; user: Record<string, unknown> }) =>
        normalizeAuthResponse(raw),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (raw: { accessToken: string; user: Record<string, unknown> }) =>
        normalizeAuthResponse(raw),
    }),
    refreshToken: builder.mutation<RefreshResponse, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation, useLogoutUserMutation } = authApi;
