// src/features/blacklist/blacklistApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface BlacklistedTenant {
  _id: string;
  tenantId: string;        // or { type: 'Tenant', ref: 'Tenant' } in your DB
  reason?: string;
  createdAt: string;
  // Possibly you store a fully populated tenant object, but let's keep it simple
}

export const blacklistApi = createApi({
  reducerPath: 'blacklistApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Blacklist'],
  endpoints: (builder) => ({
    blacklistUser: builder.mutation<any, { userId: string }>({
      query: (body) => ({
        url: '/blacklist/user',
        method: 'POST',
        body,
      }),
    }),
    addEmailToBlacklist: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/blacklist/add-email',
        method: 'POST',
        body,
      }),
    }),
    removeEmailFromBlacklist: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/blacklist/remove-email',
        method: 'DELETE',
        body,
      }),
    }),
    listBlacklistedTenants: builder.query<BlacklistedTenant[], void>({
      query: () => '/blacklist/tenants', // e.g. GET /api/blacklist/tenants
      transformResponse: (resp: { success: boolean; data: BlacklistedTenant[] }) => resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Blacklist' as const, id: _id })),
              { type: 'Blacklist', id: 'LIST' },
            ]
          : [{ type: 'Blacklist', id: 'LIST' }],
    }),

    // 2) Blacklist a tenant
    blacklistTenant: builder.mutation<any, { tenantId: string; reason?: string }>({
      query: (body) => ({
        url: '/blacklist/tenant',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Blacklist', id: 'LIST' }], // refetch blacklisted list
    }),

    // 3) Un-blacklist a tenant
    unblacklistTenant: builder.mutation<any, { tenantId: string }>({
      query: (body) => ({
        url: '/blacklist/tenant/remove',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Blacklist', id: 'LIST' }],
    }),
  }),
});

export const {
  useBlacklistUserMutation,
  useAddEmailToBlacklistMutation,
  useRemoveEmailFromBlacklistMutation,
  useBlacklistTenantMutation,
  useUnblacklistTenantMutation,
  useListBlacklistedTenantsQuery,
} = blacklistApi;
