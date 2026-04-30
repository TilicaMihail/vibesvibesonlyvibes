import { baseApi } from './baseApi';
import type { Test } from '@/types';

export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestByLesson: builder.query<Test, string>({
      query: (lessonId) => `/lessons/${lessonId}/test`,
      providesTags: (_result, _error, lessonId) => [{ type: 'Test', id: `lesson-${lessonId}` }],
    }),

    createTest: builder.mutation<Test, { lessonId: string; title: string; description?: string; timeLimitSec?: number; aiEnabled?: boolean }>({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/${lessonId}/test`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [{ type: 'Test', id: `lesson-${lessonId}` }],
    }),

    updateTest: builder.mutation<Test, { testId: string; title?: string; description?: string; timeLimitSec?: number }>({
      query: ({ testId, ...body }) => ({ url: `/tests/${testId}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { testId }) => [{ type: 'Test', id: testId }],
    }),

    publishTest: builder.mutation<Test, string>({
      query: (testId) => ({ url: `/tests/${testId}/publish`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, testId) => [{ type: 'Test', id: testId }],
    }),

    deleteTest: builder.mutation<void, string>({
      query: (testId) => ({ url: `/tests/${testId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),

    generateTestAI: builder.mutation<{ requestId: string; status: string }, { lessonId: string }>({
      query: ({ lessonId }) => ({
        url: `/lessons/${lessonId}/ai/generate-test`,
        method: 'POST',
      }),
    }),

    getAIRequestStatus: builder.query<{ status: string; requestId: string }, string>({
      query: (requestId) => `/ai/request/${requestId}/status`,
    }),

    injectAIQuestions: builder.mutation<void, string>({
      query: (requestId) => ({
        url: `/ai/request/${requestId}/inject`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetTestByLessonQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  usePublishTestMutation,
  useDeleteTestMutation,
  useGenerateTestAIMutation,
  useGetAIRequestStatusQuery,
  useInjectAIQuestionsMutation,
} = testsApi;
