import { baseApi } from './baseApi';
import type { TestSession } from '@/types';

interface CreateTestSessionPayload {
  studentId: string;
  courseId: string;
  testId?: string;
  selectedTopics: string[];
  questionCount: number;
  timeLimitSeconds?: number;
}

interface SubmitTestSessionPayload {
  sessionId: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
}

export const testSessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestSessions: builder.query<TestSession[], { studentId: string; courseId: string }>({
      query: (params) => ({ url: '/test-sessions', params }),
      providesTags: [{ type: 'TestSession', id: 'LIST' }],
    }),

    createTestSession: builder.mutation<TestSession, CreateTestSessionPayload>({
      query: (body) => ({
        url: '/test-sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TestSession', id: 'LIST' }],
    }),

    getTestSession: builder.query<TestSession, string>({
      query: (sessionId) => `/test-sessions/${sessionId}`,
      providesTags: (_result, _error, id) => [{ type: 'TestSession', id }],
    }),

    submitTestSession: builder.mutation<TestSession, SubmitTestSessionPayload>({
      query: ({ sessionId, answers }) => ({
        url: `/test-sessions/${sessionId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: 'TestSession', id: sessionId },
        { type: 'Progress', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTestSessionsQuery,
  useCreateTestSessionMutation,
  useGetTestSessionQuery,
  useSubmitTestSessionMutation,
} = testSessionsApi;
