import { baseApi } from './baseApi';
import type { Attempt, AttemptAnswer, AttemptResult } from '@/types';

export const attemptsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startAttempt: builder.mutation<Attempt, string>({
      query: (testId) => ({ url: `/tests/${testId}/start`, method: 'POST' }),
      invalidatesTags: [{ type: 'Attempt', id: 'LIST' }],
    }),
    submitAttempt: builder.mutation<AttemptResult, { attemptId: string; answers: AttemptAnswer[] }>({
      query: ({ attemptId, answers }) => ({
        url: `/attempts/${attemptId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (_result, _error, { attemptId }) => [{ type: 'Attempt', id: attemptId }],
    }),
    getAttemptResult: builder.query<AttemptResult, string>({
      query: (attemptId) => `/attempts/${attemptId}`,
      providesTags: (_result, _error, id) => [{ type: 'Attempt', id }],
    }),
  }),
});

export const { useStartAttemptMutation, useSubmitAttemptMutation, useGetAttemptResultQuery } = attemptsApi;
