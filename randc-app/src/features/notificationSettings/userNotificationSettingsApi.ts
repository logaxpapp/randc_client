// src/features/notificationSettings/userNotificationSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// Minimal shape of the client-side settings
export interface IUserNotificationSettings {
  _id: string;
  user: string; // userId
  staff?: {
    confirmation?: boolean;
    changes?: boolean;
    cancellation?: boolean;
    reminder?: {
      email?: boolean;
      daysBefore?: number;
    };
  };
  customer?: {
    confirmation?: boolean;
    changes?: boolean;
    cancellation?: boolean;
  };
  personalized?: {
    senderName?: string;
    emailSignature?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const userNotificationSettingsApi = createApi({
  reducerPath: 'userNotificationSettingsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['UserNotificationSettings'],

  endpoints: (builder) => ({
    // GET /user-notification-settings
    getUserNotificationSettings: builder.query<IUserNotificationSettings, void>({
      query: () => ({
        url: '/user-notification-settings',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: IUserNotificationSettings }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [{ type: 'UserNotificationSettings', id: 'ME' }]
          : [{ type: 'UserNotificationSettings', id: 'ME' }],
    }),

    // PATCH /user-notification-settings
    updateUserNotificationSettings: builder.mutation<
      IUserNotificationSettings,
      Partial<IUserNotificationSettings>
    >({
      query: (body) => ({
        url: '/user-notification-settings',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { success: boolean; data: IUserNotificationSettings }) =>
        response.data,
      invalidatesTags: [{ type: 'UserNotificationSettings', id: 'ME' }],
    }),
  }),
});

export const {
  useGetUserNotificationSettingsQuery,
  useUpdateUserNotificationSettingsMutation,
} = userNotificationSettingsApi;
