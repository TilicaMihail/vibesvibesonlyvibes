import { baseApi } from './baseApi';
import type { Organization } from '@/types';
import type { RootState } from '@/store';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganization: builder.query<Organization, void>({
      queryFn: async (_arg, { getState }, _extra, baseQuery) => {
        const orgId = (getState() as RootState).auth.user?.organizationId ?? '';
        const result = await baseQuery(`/organizations/${orgId}`);
        if (result.error) return { error: result.error as FetchBaseQueryError };
        return { data: result.data as Organization };
      },
      providesTags: [{ type: 'Organization', id: 'CURRENT' }],
    }),

    updateOrganization: builder.mutation<Organization, Partial<Organization>>({
      queryFn: async (body, { getState }, _extra, baseQuery) => {
        const orgId = (getState() as RootState).auth.user?.organizationId ?? '';
        const result = await baseQuery({ url: `/organizations/${orgId}`, method: 'PUT', body });
        if (result.error) return { error: result.error as FetchBaseQueryError };
        return { data: result.data as Organization };
      },
      invalidatesTags: [{ type: 'Organization', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} = organizationsApi;
