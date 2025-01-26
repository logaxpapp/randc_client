// src/features/staff/staffApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { StaffPayload, CreateStaffWithUserBody, UpdateStaffBody, StaffTransformed } from '../../types/staff';



export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Staff'],

  endpoints: (builder) => ({
  // CREATE staff + user in one call
    createStaffWithUser: builder.mutation<StaffPayload, CreateStaffWithUserBody>({
      query: (body) => ({
        url: `/staff/with-user`,
        method: 'POST',
        body,
      }),
      // Invalidate the 'Staff' tag to trigger a refetch of the list
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),

    // LIST staff
    listStaff: builder.query<StaffTransformed[], void>({
      query: () => '/staff',
      transformResponse: (resp: { success: boolean; data: any[] }) => {
        return resp.data.map(item => ({
          ...item,
          firstName: item.userId?.firstName,
          lastName: item.userId?.lastName,
          role: item.localRole,  
        }));
      },
      // Provide the same tag that is invalidated by `createStaffWithUser`
      providesTags: [{ type: 'Staff', id: 'LIST' }],
    }),
    // GET staff by ID
    getStaffById: builder.query<StaffPayload, string>({
      query: (staffId) => `/staff/${staffId}`,
      transformResponse: (resp: { success: boolean; data: StaffPayload }) => resp.data,
      providesTags: (result) =>
        result ? [{ type: 'Staff', id: result._id }, { type: 'Staff', id: 'LIST' }] : [],
    }),

    updateStaff: builder.mutation<StaffPayload, { staffId: string; body: UpdateStaffBody }>({
      query: ({ staffId, body }) => ({
        url: `/staff/${staffId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Staff', id: arg.staffId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    // DELETE staff
    deleteStaff: builder.mutation<void, string>({
      query: (staffId) => ({
        url: `/staff/${staffId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Staff', id: arg },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    // PATCH staff + user
    patchStaffUser: builder.mutation<
      StaffPayload,
      {
        staffId: string;
        staffUpdates: Partial<StaffPayload>;
        userUpdates: Partial<{
          firstName?: string;
          lastName?: string;
          roles?: string[];
          isActive?: boolean;
        }>;
      }
    >({
      query: ({ staffId, staffUpdates, userUpdates }) => ({
        url: `/staff/${staffId}/patchStaffUser`,
        method: 'PATCH',
        body: { staffUpdates, userUpdates },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Staff', id: arg.staffId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),
    // ADMIN CREATE staff + user in one call
    adminCreateStaffWithUser: builder.mutation<
      StaffPayload,
      { tenantId: string } & CreateStaffWithUserBody
    >({
      query: ({ tenantId, ...body }) => ({
        url: `/admin/tenants/${tenantId}/staff/with-user`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Staff', id: `LIST_${tenantId}` },
      ],
    }),

    // ADMIN LIST staff for a tenant
    adminListStaff: builder.query<StaffTransformed[], { tenantId: string }>({
      query: ({ tenantId }) => `/admin/tenants/${tenantId}/staff`,
      transformResponse: (resp: { success: boolean; data: any[] }) => {
        return resp.data.map((item) => ({
          ...item,
          firstName: item.userId?.firstName,
          lastName: item.userId?.lastName,
          role: item.localRole,
        }));
      },
      providesTags: (result, error, { tenantId }) => [
        { type: 'Staff', id: `LIST_${tenantId}` },
        ...result?.map((staff) => ({ type: 'Staff' as const, id: staff._id })) || [],
      ],
    }),

    // ADMIN GET staff by ID within a tenant
    adminGetStaffById: builder.query<
      StaffPayload,
      { tenantId: string; staffId: string }
    >({
      query: ({ tenantId, staffId }) => `/admin/tenants/${tenantId}/staff/${staffId}`,
      transformResponse: (resp: { success: boolean; data: StaffPayload }) => resp.data,
      providesTags: (result, error, { tenantId, staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: `LIST_${tenantId}` },
      ],
    }),

    // ADMIN UPDATE staff within a tenant
    adminUpdateStaff: builder.mutation<
      StaffPayload,
      { tenantId: string; staffId: string; body: UpdateStaffBody }
    >({
      query: ({ tenantId, staffId, body }) => ({
        url: `/admin/tenants/${tenantId}/staff/${staffId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { tenantId, staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: `LIST_${tenantId}` },
      ],
    }),

    // ADMIN DELETE staff within a tenant
    adminDeleteStaff: builder.mutation<
      void,
      { tenantId: string; staffId: string }
    >({
      query: ({ tenantId, staffId }) => ({
        url: `/admin/tenants/${tenantId}/staff/${staffId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { tenantId, staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: `LIST_${tenantId}` },
      ],
    }),

    // ADMIN PATCH staff + user within a tenant
    adminPatchStaffUser: builder.mutation<
      StaffPayload,
      {
        tenantId: string;
        staffId: string;
        staffUpdates: Partial<StaffPayload>;
        userUpdates: Partial<{
          firstName?: string;
          lastName?: string;
          roles?: string[];
          isActive?: boolean;
        }>;
      }
    >({
      query: ({ tenantId, staffId, staffUpdates, userUpdates }) => ({
        url: `/admin/tenants/${tenantId}/staff/${staffId}/patchStaffUser`,
        method: 'PATCH',
        body: { staffUpdates, userUpdates },
      }),
      invalidatesTags: (result, error, { tenantId, staffId }) => [
        { type: 'Staff', id: staffId },
        { type: 'Staff', id: `LIST_${tenantId}` },
      ],
    }),
  }),
});

export const {
  useCreateStaffWithUserMutation,
  useListStaffQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  usePatchStaffUserMutation,

  // Admin queries/mutations
  useAdminCreateStaffWithUserMutation,
  useAdminListStaffQuery,
  useAdminGetStaffByIdQuery,
  useAdminUpdateStaffMutation,
  useAdminDeleteStaffMutation,
  useAdminPatchStaffUserMutation,
} = staffApi;
