// src/features/staffSchedule/staffScheduleApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/** For staff availability doc */
export interface StaffAvailability {
  _id: string;
  type: 'ONE_TIME' | 'RECURRING';
  startDateTime?: string;
  endDateTime?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  label?: string;
  priority?: 'LOW'|'MEDIUM'|'HIGH';
  breaks?: { start: string; end: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** If you want to store staff here as well. Could be string or an object. */
  staff?: string | { _id: string; [key: string]: any };
}

/** For staff absence doc */
export interface StaffAbsence {
  _id: string;
  startDateTime: string;
  endDateTime: string;
  reason?: string;
  approved?: boolean;
  createdAt: string;
  updatedAt: string;
  staff: string | { _id: string; [key: string]: any };
}


type CreateAbsenceInput = {
  staffId: string; 
  startDateTime: string;
  endDateTime: string;
  reason?: string;
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const staffScheduleApi = createApi({
  reducerPath: 'staffScheduleApi',
  baseQuery: customBaseQuery,
  tagTypes: ['StaffAvail', 'StaffAbsence'],

  endpoints: (builder) => ({

    // ─────────────────────────────────────────────────
    // AVAILABILITY
    // ─────────────────────────────────────────────────

    /** CREATE an availability => POST /staff-schedule/avail */
    createAvailability: builder.mutation<StaffAvailability, Partial<StaffAvailability>>({
      query: (body) => ({
        url: '/staff-schedule/avail',
        method: 'POST',
        body: {
          ...body,
          priority: body.priority || 'MEDIUM', 
          breaks: body.breaks || [], 
        },
      }),      
      transformResponse: (resp: ApiResponse<StaffAvailability>) => resp.data,
      invalidatesTags: [{ type: 'StaffAvail', id: 'LIST' }],
    }),

    /** LIST availabilities => GET /staff-schedule/avail */
    listAvailabilities: builder.query<
      StaffAvailability[],
      { type?: string; isActive?: boolean; fromDate?: string; toDate?: string } | void
    >({
      query: (params) => {
        let url = '/staff-schedule/avail';
        if (params) {
          const qs = new URLSearchParams();
          if (params.type) qs.append('type', params.type);
          if (typeof params.isActive === 'boolean') {
            qs.append('isActive', params.isActive.toString());
          }
          if (params.fromDate) qs.append('fromDate', params.fromDate);
          if (params.toDate) qs.append('toDate', params.toDate);
          if ([...qs].length) url += `?${qs.toString()}`;
        }
        return url;
      },
      transformResponse: (resp: ApiResponse<StaffAvailability[]>) => {
        return resp.data.map(avail => ({
          ...avail,
          priority: avail.priority || 'MEDIUM',
          breaks: avail.breaks || [], 
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((av) => ({ type: 'StaffAvail' as const, id: av._id })),
              { type: 'StaffAvail', id: 'LIST' },
            ]
          : [{ type: 'StaffAvail', id: 'LIST' }],
    }),

    /** UPDATE an availability => PUT /staff-schedule/avail/:availabilityId */
    updateAvailability: builder.mutation<
      StaffAvailability,
      { availabilityId: string; body: Partial<StaffAvailability> }
    >({
      query: ({ availabilityId, body }) => ({
        url: `/staff-schedule/avail/${availabilityId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (resp: ApiResponse<StaffAvailability>) => resp.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'StaffAvail', id: arg.availabilityId },
        { type: 'StaffAvail', id: 'LIST' },
      ],
    }),

    /** DELETE availability => DELETE /staff-schedule/avail/:availabilityId */
  deleteAvailability: builder.mutation<
  { success: boolean; message: string; data?: StaffAvailability }, 
  { availabilityId: string }
  >({
  query: ({ availabilityId }) => ({
    url: `/staff-schedule/avail/${availabilityId}`,
    method: 'DELETE',
  }),
  transformResponse: (resp: { success: boolean; message: string; data?: StaffAvailability }) => resp, 
  invalidatesTags: (result, error, arg) => [
    { type: 'StaffAvail', id: arg.availabilityId },
    { type: 'StaffAvail', id: 'LIST' },
  ],
  }),


    /** ASSIGN staff => PUT /staff-schedule/:availabilityId/assign 
     *   Body: { newStaffId: string }
     */
    assignStaffToAvailability: builder.mutation<
      StaffAvailability,
      { availabilityId: string; newStaffId: string }
    >({
      query: ({ availabilityId, newStaffId }) => ({
        url: `/staff-schedule/${availabilityId}/assign`,
        method: 'PUT',
        body: { newStaffId },
      }),
      transformResponse: (resp: ApiResponse<StaffAvailability>) => resp.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'StaffAvail', id: arg.availabilityId },
        { type: 'StaffAvail', id: 'LIST' },
      ],
    }),

    /** UNASSIGN staff => PUT /staff-schedule/:availabilityId/unassign 
     *  No body required 
     */
    unassignStaffFromAvailability: builder.mutation<
      StaffAvailability,
      { availabilityId: string }
    >({
      query: ({ availabilityId }) => ({
        url: `/staff-schedule/${availabilityId}/unassign`,
        method: 'PUT',
      }),
      transformResponse: (resp: ApiResponse<StaffAvailability>) => resp.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'StaffAvail', id: arg.availabilityId },
        { type: 'StaffAvail', id: 'LIST' },
      ],
    }),

    // ─────────────────────────────────────────────────
    // ABSENCES
    // ─────────────────────────────────────────────────

    /** CREATE absence => POST /staff-schedule/absences */
    createAbsence: builder.mutation<StaffAbsence, CreateAbsenceInput>({
      query: (body) => ({
        url: '/staff-schedule/absences',
        method: 'POST',
        body,
      }),
      transformResponse: (resp: ApiResponse<StaffAbsence>) => resp.data,
      invalidatesTags: [{ type: 'StaffAbsence', id: 'LIST' }],
    }),

    /** LIST absences => GET /staff-schedule/absences */
    listAbsences: builder.query<
      StaffAbsence[],
      { fromDate?: string; toDate?: string; approved?: boolean } | void
    >({
      query: (params) => {
        let url = '/staff-schedule/absences';
        if (params) {
          const qs = new URLSearchParams();
          if (params.fromDate) qs.append('fromDate', params.fromDate);
          if (params.toDate) qs.append('toDate', params.toDate);
          if (typeof params.approved === 'boolean') {
            qs.append('approved', params.approved.toString());
          }
          if ([...qs].length) url += `?${qs.toString()}`;
        }
        return url;
      },
      transformResponse: (resp: ApiResponse<StaffAbsence[]>) => resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((ab) => ({ type: 'StaffAbsence' as const, id: ab._id })),
              { type: 'StaffAbsence', id: 'LIST' },
            ]
          : [{ type: 'StaffAbsence', id: 'LIST' }],
    }),

    /** UPDATE absence => PUT /staff-schedule/absences/:absenceId */
    updateAbsence: builder.mutation<
      StaffAbsence,
      { absenceId: string; body: Partial<StaffAbsence> }
    >({
      query: ({ absenceId, body }) => ({
        url: `/staff-schedule/absences/${absenceId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (resp: ApiResponse<StaffAbsence>) => resp.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'StaffAbsence', id: arg.absenceId },
        { type: 'StaffAbsence', id: 'LIST' },
      ],
    }),

    /** DELETE absence => DELETE /staff-schedule/absences/:absenceId */
    deleteAbsence: builder.mutation<
      StaffAbsence,
      { absenceId: string }
    >({
      query: ({ absenceId }) => ({
        url: `/staff-schedule/absences/${absenceId}`,
        method: 'DELETE',
      }),
      transformResponse: (resp: ApiResponse<StaffAbsence>) => resp.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'StaffAbsence', id: arg.absenceId },
        { type: 'StaffAbsence', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  /** AVAILABILITY */
  useCreateAvailabilityMutation,
  useListAvailabilitiesQuery,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useAssignStaffToAvailabilityMutation,
  useUnassignStaffFromAvailabilityMutation,

  /** ABSENCES */
  useCreateAbsenceMutation,
  useListAbsencesQuery,
  useUpdateAbsenceMutation,
  useDeleteAbsenceMutation,
} = staffScheduleApi;
