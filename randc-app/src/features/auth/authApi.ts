// src/features/auth/authApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

interface RegisterTempUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];   // add this
  tenantId?: string;  // add this if needed
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // admin/create-tenant-user
    createAdminUser: builder.mutation<any, RegisterTempUserRequest>({
      query: (body) => ({
        url: '/admin/create-tenant-user',
        method: 'POST',
        body,
      }),
    }),

    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    requestPasswordReset: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<any, { email: string; code: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    getProfile: builder.query<any, void>({
      query: () => ({
        url: '/auth/me',
      }),
    }),

    // New: requestEmailVerification
    requestEmailVerification: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/auth/request-email-verification',
        method: 'POST',
        body,
      }),
    }),

    // New: verifyEmailCode
    verifyEmailCode: builder.mutation<any, { email: string; code: string }>({
      query: (body) => ({
        url: '/auth/verify-email-code',
        method: 'POST',
        body,
      }),
    }),

    // 1) Register Tenant + Owner in one go
    registerTenantAndOwner: builder.mutation<
      any,
      {
        tenantName: string;
        domain?: string;
        aboutUs?: string;
        images?: string[];
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: '/auth/register-tenant-and-owner',
        method: 'POST',
        body,
      }),
    }),

    // 2) registerUserOnly
    registerUserOnly: builder.mutation<
      any,
      {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        roles?: string[];
        tenantId?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/register-user',
        method: 'POST',
        body,
      }),
    }),

    // Update Profile
    updateProfile: builder.mutation<
      any,
      { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string }
    >({
      query: (body) => ({
        url: '/auth/update-profile',
        method: 'PATCH',
        body,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),

    uploadAvatar: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/auth/upload-avatar',
        method: 'POST',
        body: formData,
      }),
    }),

    enableMFA: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/enable-mfa',
        method: 'POST',
      }),
    }),

    verifyMFASetup: builder.mutation<any, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-mfa-setup',
        method: 'POST',
        body,
      }),
    }),

    listTenantUsers: builder.query<any[], void>({
      query: () => ({
        url: '/auth/tenant-users',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: any[] }) => response.data,
    }),

    // -----------------------
    // NEW MUTATION:
    // /auth/register-and-login-user
    // calls your "registerAndLoginUser" in AuthController
    // for the 3-step process: request code -> verify -> register + login
    registerAndLoginUser: builder.mutation<
      any,
      {
        email: string;
        code?: string; // optional if verifying
        firstName?: string;
        lastName?: string;
        roles?: string[];
        password?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/register-and-login-user',
        method: 'POST',
        body,
      }),
    }),
    // -----------------------
  }),
});

export const {
  // existing
  useLoginUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useListTenantUsersQuery,
  useRequestEmailVerificationMutation,
  useVerifyEmailCodeMutation,
  useRegisterTenantAndOwnerMutation,
  useRegisterUserOnlyMutation,
  useCreateAdminUserMutation,
  useEnableMFAMutation,
  useVerifyMFASetupMutation,

  // new
  useRegisterAndLoginUserMutation,
} = authApi;
