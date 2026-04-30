import { baseApi } from './baseApi';
import type { Course, CourseCreatePayload, CourseUpdatePayload } from '@/types';

interface GetCoursesParams {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  visibility?: 'PRIVATE' | 'PUBLIC';
}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], GetCoursesParams | void>({
      query: (params) => ({ url: '/courses', params: params ?? {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Course' as const, id })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
    }),

    getCourse: builder.query<Course, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (_result, _error, id) => [{ type: 'Course', id }],
    }),

    createCourse: builder.mutation<Course, CourseCreatePayload>({
      query: (body) => ({ url: '/courses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    updateCourse: builder.mutation<Course, { id: string } & CourseUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `/courses/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({ url: `/courses/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    enrollInCourse: builder.mutation<void, string>({
      query: (courseId) => ({ url: `/courses/${courseId}/enroll`, method: 'POST' }),
      invalidatesTags: (_result, _error, courseId) => [{ type: 'Course', id: courseId }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollInCourseMutation,
} = coursesApi;
