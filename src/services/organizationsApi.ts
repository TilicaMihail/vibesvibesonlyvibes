import { baseApi } from './baseApi';
import type { Organization } from '@/types';

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganization: builder.query<Organization, void>({
      query: () => '/organizations',
      providesTags: [{ type: 'Organization', id: 'CURRENT' }],
    }),

    updateOrganization: builder.mutation<Organization, Partial<Organization>>({
      query: (body) => ({
        url: '/organizations',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Organization', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} = organizationsApi;
