import { baseApi } from './baseApi';
import type { Chapter } from '@/types';

export const chaptersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query<Chapter[], string>({
      query: (courseId) => `/courses/${courseId}/chapters`,
      providesTags: (_result, _error, courseId) => [{ type: 'Content', id: courseId }],
    }),

    createChapter: builder.mutation<Chapter, { courseId: string; title: string }>({
      query: ({ courseId, title }) => ({
        url: `/courses/${courseId}/chapters`,
        method: 'POST',
        body: title,
        headers: { 'Content-Type': 'text/plain' },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Content', id: courseId }],
    }),

    updateChapter: builder.mutation<Chapter, { id: string; title?: string; orderIndex?: number }>({
      query: ({ id, ...body }) => ({ url: `/chapters/${id}`, method: 'PUT', body }),
      invalidatesTags: () => [{ type: 'Content', id: 'LIST' }],
    }),

    deleteChapter: builder.mutation<void, { id: string; courseId: string }>({
      query: ({ id }) => ({ url: `/chapters/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { courseId }) => [{ type: 'Content', id: courseId }],
    }),
  }),
});

export const {
  useGetChaptersQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} = chaptersApi;
