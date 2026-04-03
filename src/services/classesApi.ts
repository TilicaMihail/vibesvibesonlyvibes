import { baseApi } from './baseApi';
import type { Class, ClassCreatePayload, ClassUpdatePayload, UserPublic } from '@/types';

type ClassWithMembers = Class & { teachers: UserPublic[]; students: UserPublic[] };

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], { search?: string } | void>({
      query: (params) => ({
        url: '/classes',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Class' as const, id })),
              { type: 'Class', id: 'LIST' },
            ]
          : [{ type: 'Class', id: 'LIST' }],
    }),

    getClass: builder.query<ClassWithMembers, string>({
      query: (classId) => `/classes/${classId}`,
      providesTags: (_result, _error, id) => [{ type: 'Class', id }],
    }),

    createClass: builder.mutation<Class, ClassCreatePayload>({
      query: (body) => ({
        url: '/classes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Class', id: 'LIST' }],
    }),

    updateClass: builder.mutation<Class, { id: string } & ClassUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Class', id },
        { type: 'Class', id: 'LIST' },
      ],
    }),

    updateClassStudents: builder.mutation<Class, { classId: string; studentIds: string[] }>({
      query: ({ classId, studentIds }) => ({
        url: `/classes/${classId}/students`,
        method: 'PUT',
        body: { studentIds },
      }),
      invalidatesTags: (_result, _error, { classId }) => [{ type: 'Class', id: classId }],
    }),

    getClassStudents: builder.query<UserPublic[], string>({
      query: (classId) => `/classes/${classId}/students`,
      providesTags: (_result, _error, classId) => [{ type: 'Class', id: classId }],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useUpdateClassStudentsMutation,
  useGetClassStudentsQuery,
} = classesApi;
