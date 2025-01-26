// src/features/settings/settingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/** The shape of your settings. Adjust if needed. */
interface ISystemSettings {
  _id?: string;
  passwordValidityDays: number;
  passwordReminderDays: number;
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getSettings: builder.query<ISystemSettings, void>({
      query: () => ({
        url: '/settings',
        method: 'GET',
      }),
    }),
    updateSettings: builder.mutation<
      ISystemSettings,
      { passwordValidityDays: number; passwordReminderDays: number }
    >({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;
