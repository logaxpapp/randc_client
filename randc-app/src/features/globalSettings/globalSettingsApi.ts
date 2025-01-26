// src/features/globalSettings/globalSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { GlobalSettings } from '../../types/GlobalSettings';

export const globalSettingsApi = createApi({
  reducerPath: 'globalSettingsApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getGlobalSettings: builder.query<GlobalSettings, void>({
      query: () => '/global-settings',
      transformResponse: (response: { success: boolean; data: GlobalSettings }) => response.data,
    }),
    updateGlobalSettings: builder.mutation<GlobalSettings, Partial<GlobalSettings>>({
      query: (body) => ({
        url: '/global-settings',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
} = globalSettingsApi;
