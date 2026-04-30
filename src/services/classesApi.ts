import { baseApi } from './baseApi';
import type { Classroom, ClassroomMember, ClassroomCreatePayload, ClassroomUpdatePayload } from '@/types';

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassrooms: builder.query<Classroom[], { search?: string } | void>({
      query: (params) => ({ url: '/classrooms', params: params ?? {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Class' as const, id })),
              { type: 'Class', id: 'LIST' },
            ]
          : [{ type: 'Class', id: 'LIST' }],
    }),

    getClassroom: builder.query<Classroom, string>({
      query: (classId) => `/classrooms/${classId}`,
      providesTags: (_result, _error, id) => [{ type: 'Class', id }],
    }),

    createClassroom: builder.mutation<Classroom, ClassroomCreatePayload>({
      query: (body) => ({ url: '/classrooms', method: 'POST', body }),
      invalidatesTags: [{ type: 'Class', id: 'LIST' }],
    }),

    updateClassroom: builder.mutation<Classroom, { id: string } & ClassroomUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `/classrooms/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Class', id },
        { type: 'Class', id: 'LIST' },
      ],
    }),

    getClassroomMembers: builder.query<ClassroomMember[], { classId: string; role?: 'TEACHER' | 'STUDENT' }>({
      query: ({ classId, role }) => ({ url: `/classrooms/${classId}/members`, params: role ? { role } : {} }),
      providesTags: (_result, _error, { classId }) => [{ type: 'Class', id: `members-${classId}` }],
    }),

    addClassroomMembers: builder.mutation<void, { classId: string; memberIds: string[] }>({
      query: ({ classId, memberIds }) => ({
        url: `/classrooms/${classId}/members`,
        method: 'POST',
        body: { memberIds },
      }),
      invalidatesTags: (_result, _error, { classId }) => [{ type: 'Class', id: `members-${classId}` }],
    }),

    removeClassroomMembers: builder.mutation<void, { classId: string; memberIds: string[] }>({
      query: ({ classId, memberIds }) => ({
        url: `/classrooms/${classId}/members`,
        method: 'DELETE',
        body: { memberIds },
      }),
      invalidatesTags: (_result, _error, { classId }) => [{ type: 'Class', id: `members-${classId}` }],
    }),

    assignCoursesToClassroom: builder.mutation<void, { classId: string; courseIds: string[] }>({
      query: ({ classId, courseIds }) => ({
        url: `/classrooms/${classId}/courses`,
        method: 'POST',
        body: { courseIds },
      }),
      invalidatesTags: (_result, _error, { classId }) => [{ type: 'Class', id: classId }],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useGetClassroomQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useGetClassroomMembersQuery,
  useAddClassroomMembersMutation,
  useRemoveClassroomMembersMutation,
  useAssignCoursesToClassroomMutation,
} = classesApi;
