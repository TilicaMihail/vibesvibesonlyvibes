import { baseApi } from './baseApi';
import type { Question } from '@/types';

const questionsBase = process.env.NEXT_PUBLIC_API_BASE_URL_NO_V1 ?? 'https://backend-for-render-ws6z.onrender.com/api';

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], string>({
      query: (testId) => `${questionsBase}/tests/${testId}/questions`,
      providesTags: (_result, _error, testId) => [{ type: 'Test', id: `questions-${testId}` }],
    }),
    createQuestion: builder.mutation<Question, { testId: string; body: Omit<Question, 'questionId'> }>({
      query: ({ testId, body }) => ({
        url: `${questionsBase}/tests/${testId}/questions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { testId }) => [{ type: 'Test', id: `questions-${testId}` }],
    }),
    updateQuestion: builder.mutation<Question, { testId: string; questionId: number; body: Partial<Question> }>({
      query: ({ testId, questionId, body }) => ({
        url: `${questionsBase}/tests/${testId}/questions/${questionId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { testId }) => [{ type: 'Test', id: `questions-${testId}` }],
    }),
    deleteQuestion: builder.mutation<void, { testId: string; questionId: number }>({
      query: ({ testId, questionId }) => ({
        url: `${questionsBase}/tests/${testId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { testId }) => [{ type: 'Test', id: `questions-${testId}` }],
    }),
  }),
});

export const { useGetQuestionsQuery, useCreateQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } = questionsApi;
