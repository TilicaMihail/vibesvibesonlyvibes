import { baseApi } from './baseApi';
import type { Course, CourseCreatePayload, CourseUpdatePayload, ContentNode, UserPublic } from '@/types';

interface GetCoursesParams {
  teacherId?: string;
  tab?: string;
  search?: string;
  studentId?: string;
}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], GetCoursesParams | void>({
      query: (params) => ({
        url: '/courses',
        params: params ?? {},
      }),
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
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    updateCourse: builder.mutation<Course, { id: string } & CourseUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),

    getCourseContent: builder.query<ContentNode[], string>({
      query: (courseId) => `/courses/${courseId}/content`,
      providesTags: (_result, _error, courseId) => [{ type: 'Content', id: courseId }],
    }),

    updateCourseContent: builder.mutation<ContentNode[], { courseId: string; content: ContentNode[] }>({
      query: ({ courseId, content }) => ({
        url: `/courses/${courseId}/content`,
        method: 'PUT',
        body: content,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Content', id: courseId }],
    }),

    getCourseEnrollments: builder.query<UserPublic[], string>({
      query: (courseId) => `/courses/${courseId}/enrollments`,
      providesTags: (_result, _error, courseId) => [{ type: 'Course', id: courseId }],
    }),

    enrollStudent: builder.mutation<void, { courseId: string; studentId: string }>({
      query: ({ courseId, studentId }) => ({
        url: `/courses/${courseId}/enrollments`,
        method: 'POST',
        body: { studentId },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    unenrollStudent: builder.mutation<void, { courseId: string; studentId: string }>({
      query: ({ courseId, studentId }) => ({
        url: `/courses/${courseId}/enrollments`,
        method: 'DELETE',
        body: { studentId },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseContentQuery,
  useUpdateCourseContentMutation,
  useGetCourseEnrollmentsQuery,
  useEnrollStudentMutation,
  useUnenrollStudentMutation,
} = coursesApi;
