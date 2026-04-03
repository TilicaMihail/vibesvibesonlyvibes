import { baseApi } from './baseApi';
import type { CourseProgress, ActivityEntry } from '@/types';

interface GetCourseProgressParams {
  userId: string;
  courseId: string;
}

interface MarkResourceCompletePayload {
  userId: string;
  courseId: string;
  contentNodeId: string;
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProgress: builder.query<CourseProgress[], string>({
      query: (userId) => `/progress/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Progress', id: userId }],
    }),

    getCourseProgress: builder.query<CourseProgress, GetCourseProgressParams>({
      query: ({ userId, courseId }) => ({
        url: `/progress/${userId}`,
        params: { courseId },
      }),
      providesTags: (_result, _error, { userId, courseId }) => [
        { type: 'Progress', id: `${userId}-${courseId}` },
      ],
    }),

    markResourceComplete: builder.mutation<void, MarkResourceCompletePayload>({
      query: ({ userId, courseId, contentNodeId }) => ({
        url: `/progress/${userId}/resource`,
        method: 'POST',
        body: { courseId, contentNodeId },
      }),
      invalidatesTags: (_result, _error, { userId, courseId }) => [
        { type: 'Progress', id: userId },
        { type: 'Progress', id: `${userId}-${courseId}` },
      ],
    }),

    getUserActivity: builder.query<ActivityEntry[], string>({
      query: (userId) => `/progress/${userId}/activity`,
      providesTags: (_result, _error, userId) => [{ type: 'Progress', id: `activity-${userId}` }],
    }),
  }),
});

export const {
  useGetUserProgressQuery,
  useGetCourseProgressQuery,
  useMarkResourceCompleteMutation,
  useGetUserActivityQuery,
} = progressApi;
