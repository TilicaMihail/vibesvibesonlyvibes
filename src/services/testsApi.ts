import { baseApi } from './baseApi';
import type { Test, Question } from '@/types';

interface GetCourseTestsParams {
  courseId: string;
}

interface GetTestParams {
  courseId: string;
  testId: string;
}

interface CreateTestParams {
  courseId: string;
  body: Partial<Test>;
}

interface UpdateTestParams {
  courseId: string;
  testId: string;
  body: Partial<Test>;
}

interface GenerateTestParams {
  courseId: string;
  topics: string[];
  count: number;
  title?: string;
}

export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseTests: builder.query<Test[], GetCourseTestsParams>({
      query: ({ courseId }) => `/courses/${courseId}/tests`,
      providesTags: (result, _error, { courseId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Test' as const, id })),
              { type: 'Test', id: `COURSE-${courseId}` },
            ]
          : [{ type: 'Test', id: `COURSE-${courseId}` }],
    }),

    getTest: builder.query<Test, GetTestParams>({
      query: ({ courseId, testId }) => `/courses/${courseId}/tests/${testId}`,
      providesTags: (_result, _error, { testId }) => [{ type: 'Test', id: testId }],
    }),

    createTest: builder.mutation<Test, CreateTestParams>({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/tests`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: 'Test', id: `COURSE-${courseId}` },
      ],
    }),

    updateTest: builder.mutation<Test, UpdateTestParams>({
      query: ({ courseId, testId, body }) => ({
        url: `/courses/${courseId}/tests/${testId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { testId, courseId }) => [
        { type: 'Test', id: testId },
        { type: 'Test', id: `COURSE-${courseId}` },
      ],
    }),

    generateTest: builder.mutation<{ questions: Question[] }, GenerateTestParams>({
      query: ({ courseId, topics, count, title }) => ({
        url: `/courses/${courseId}/tests/generate`,
        method: 'POST',
        body: { topics, count, title },
      }),
      // No invalidation — generate no longer saves a test
    }),
  }),
});

export const {
  useGetCourseTestsQuery,
  useGetTestQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useGenerateTestMutation,
} = testsApi;
