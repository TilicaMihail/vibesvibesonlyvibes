import { baseApi } from './baseApi';
import type { UserPublic, UserCreatePayload, UserUpdatePayload, UserRole } from '@/types';

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
      query: (params) => ({
        url: '/users',
        params: params ?? {},
      }),
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
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserPublic, { id: string } & UserUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    toggleUserActive: builder.mutation<UserPublic, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserActiveMutation,
} = usersApi;
