// src/features/notificationSettings/notificationSettingsApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { NotificationSettings } from '../../types/NotificationSettings';

/**
 * RTK Query slice for Notification Settings
 */
export const notificationSettingsApi = createApi({
  reducerPath: 'notificationSettingsApi',

  // Use your custom baseQuery
  baseQuery: customBaseQuery,

  // We define a tag type 'NotificationSettings'
  tagTypes: ['NotificationSettings'],

  endpoints: (builder) => ({
    /**
     * GET /notification-settings
     * Returns the user's notification settings for the current tenant.
     */
    getMyNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => ({
        url: '/notification-settings',
        method: 'GET',
      }),
      // Our server returns { success: boolean, data: NotificationSettings }
      // so we transform to just the data
      transformResponse: (response: { success: boolean; data: NotificationSettings }) =>
        response.data,
      // We "provide" a tag for the 'ME' resource so it can be invalidated
      providesTags: (result) =>
        result
          ? [{ type: 'NotificationSettings', id: 'ME' }]
          : [{ type: 'NotificationSettings', id: 'ME' }],
    }),

    /**
     * PATCH /notification-settings
     * Updates the user's notification settings
     */
    updateMyNotificationSettings: builder.mutation<
      NotificationSettings,
      Partial<NotificationSettings>
    >({
      query: (body) => ({
        url: '/notification-settings',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { success: boolean; data: NotificationSettings }) =>
        response.data,
      // Invalidate the 'ME' resource so that getMyNotificationSettings is re-fetched on next usage
      invalidatesTags: [{ type: 'NotificationSettings', id: 'ME' }],
    }),
  }),
});

// Export the hooks
export const {
  useGetMyNotificationSettingsQuery,
  useUpdateMyNotificationSettingsMutation,
} = notificationSettingsApi;
