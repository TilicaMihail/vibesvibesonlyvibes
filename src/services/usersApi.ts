import { baseApi } from './baseApi';
import type { UserPublic, UserCreatePayload, UserUpdatePayload, UserStatusUpdatePayload, UserRole } from '@/types';
import type { RootState } from '@/store';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface GetUsersParams {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
}

interface GetUsersResponse {
  users: UserPublic[];
  total: number;
  page: number;
  limit: number;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersParams | void>({
      queryFn: async (params, { getState }, _extra, baseQuery) => {
        const orgId = (getState() as RootState).auth.user?.organizationId ?? '';
        const result = await baseQuery({
          url: `/organizations/${orgId}/users`,
          params: params ?? {},
        });
        if (result.error) return { error: result.error as FetchBaseQueryError };
        const data = result.data as UserPublic[] | GetUsersResponse;
        if (Array.isArray(data)) {
          return { data: { users: data, total: data.length, page: 1, limit: data.length } };
        }
        return { data: data as GetUsersResponse };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUser: builder.query<UserPublic, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserPublic, UserCreatePayload>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserPublic, { id: string } & UserUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    updateUserStatus: builder.mutation<UserPublic, { userId: string } & UserStatusUpdatePayload>({
      query: ({ userId, ...body }) => ({ url: `/users/${userId}/status`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} = usersApi;
