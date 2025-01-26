// src/features/user/userApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { User } from '../../types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    listUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (response: { success: boolean; data: User[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Mutation to create a new user
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/users', // Adjust the endpoint as needed
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'], 
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    updateUser: builder.mutation<{ success: boolean }, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    activateUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    deactivateUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    selfUpdateUser: builder.mutation<{ success: boolean }, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/self-update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    updateProfileImage: builder.mutation<{ success: boolean }, { userId: string; file: File }>({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: `/users/${userId}/profile-image`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    associateTenant: builder.mutation<{ success: boolean }, { userId: string; tenantId: string }>({
      query: ({ userId, tenantId }) => ({
        url: `/users/${userId}/associate-tenant`,
        method: 'PUT',
        body: { tenantId },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useSelfUpdateUserMutation,
  useUpdateProfileImageMutation,
  useAssociateTenantMutation,
} = userApi;
