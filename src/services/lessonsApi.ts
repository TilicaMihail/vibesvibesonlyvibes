import { baseApi } from './baseApi';
import type { Lesson, LessonResource } from '@/types';

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], string>({
      query: (chapterId) => `/chapters/${chapterId}/lessons`,
      providesTags: (_result, _error, chapterId) => [{ type: 'Content', id: `chapter-${chapterId}` }],
    }),

    createLesson: builder.mutation<Lesson, { chapterId: string; title: string; contentMarkdown?: string }>({
      query: ({ chapterId, ...body }) => ({
        url: `/chapters/${chapterId}/lessons`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { chapterId }) => [{ type: 'Content', id: `chapter-${chapterId}` }],
    }),

    updateLesson: builder.mutation<Lesson, { id: string; title?: string; contentMarkdown?: string; orderIndex?: number }>({
      query: ({ id, ...body }) => ({ url: `/lessons/${id}`, method: 'PATCH', body }),
      invalidatesTags: () => [{ type: 'Content', id: 'LIST' }],
    }),

    deleteLesson: builder.mutation<void, { id: string; chapterId: string }>({
      query: ({ id }) => ({ url: `/lessons/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { chapterId }) => [{ type: 'Content', id: `chapter-${chapterId}` }],
    }),

    getLessonResources: builder.query<LessonResource[], string>({
      query: (lessonId) => `/lessons/${lessonId}/resources`,
      providesTags: (_result, _error, lessonId) => [{ type: 'Content', id: `resources-${lessonId}` }],
    }),

    createLessonResource: builder.mutation<LessonResource, { lessonId: string; title: string; url: string }>({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/${lessonId}/resources`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [{ type: 'Content', id: `resources-${lessonId}` }],
    }),

    deleteLessonResource: builder.mutation<void, { lessonId: string; resourceId: string }>({
      query: ({ lessonId, resourceId }) => ({
        url: `/lessons/${lessonId}/resources/${resourceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [{ type: 'Content', id: `resources-${lessonId}` }],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetLessonResourcesQuery,
  useCreateLessonResourceMutation,
  useDeleteLessonResourceMutation,
} = lessonsApi;
