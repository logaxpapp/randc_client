// src/features/timeSlot/timeSlotApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// Updated TimeSlotPayload with mandatory _id
export interface TimeSlotPayload {
  _id: string; // Made mandatory
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedCount: number;
  maxCapacity: number;
  createdAt?: string;
}

// Optional query params for filtering time slots
export interface GetAllSlotsArgs {
  from?: string; // e.g. "2023-10-01"
  to?: string;   // e.g. "2023-10-31"
  day?: string;  // e.g. "Monday"
}


// For bulk generation with start/end dates
export interface GenerateSlotsBody {
  slotDuration: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

export const timeSlotApi = createApi({
  reducerPath: 'timeSlotApi',
  baseQuery: customBaseQuery,
  tagTypes: ['TimeSlot'],

  endpoints: (builder) => ({
    // Bulk generate
    generateTimeSlots: builder.mutation<any, GenerateSlotsBody>({
      query: (body) => ({
        url: `/timeslots/generate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TimeSlot', id: 'LIST' }],
    }),

    // Create single slot
    createTimeSlot: builder.mutation<any, Partial<TimeSlotPayload>>({
      query: (body) => ({
        url: `/timeslots`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TimeSlot', id: 'LIST' }],
    }),

   // GET all time slots (with optional filters: from, to, day)
   getAllTimeSlots: builder.query<TimeSlotPayload[], GetAllSlotsArgs | void>({
    query: (args) => {
      // Build query string from optional args
      const params = new URLSearchParams();
      if (args?.from) params.set('from', args.from);
      if (args?.to)   params.set('to',   args.to);
      if (args?.day)  params.set('day',  args.day);

      // e.g. GET /timeslots?from=2023-10-01&to=2023-10-31&day=Monday
      const url = `/timeslots?${params.toString()}`;
      return url;
    },
    transformResponse: (resp: { success: boolean; data: TimeSlotPayload[] }) => resp.data,
    providesTags: (result) =>
      result
        ? [
            ...result.map((slot) => ({ type: 'TimeSlot' as const, id: slot._id })),
            { type: 'TimeSlot', id: 'LIST' },
          ]
        : [{ type: 'TimeSlot', id: 'LIST' }],
  }),
    getServiceSlotsByDate: builder.query<TimeSlotPayload[], { serviceId: string; date: string }>({
      query: ({ serviceId, date }) => `/services/${serviceId}/timeSlots?date=${date}`,
      transformResponse: (resp: { success: boolean; data: TimeSlotPayload[] }) => resp.data,
    }),

  // GET single time slot by ID
  getTimeSlotById: builder.query<TimeSlotPayload, string>({
    query: (slotId) => `/timeslots/${slotId}`,
    transformResponse: (resp: { success: boolean; data: TimeSlotPayload }) => resp.data,
    providesTags: (result) =>
      result ? [{ type: 'TimeSlot', id: result._id }] : [],
  }),

    // Update
    updateTimeSlot: builder.mutation<any, { slotId: string; body: Partial<TimeSlotPayload> }>({
      query: ({ slotId, body }) => ({
        url: `/timeslots/${slotId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'TimeSlot', id: arg.slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Delete
    deleteTimeSlot: builder.mutation<any, string>({
      query: (slotId) => ({
        url: `/timeslots/${slotId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slotId) => [
        { type: 'TimeSlot', id: slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Book
    bookSlot: builder.mutation<any, string>({
      query: (slotId) => ({
        url: `/timeslots/${slotId}/book`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slotId) => [
        { type: 'TimeSlot', id: slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Unbook
    unbookSlot: builder.mutation<any, string>({
      query: (slotId) => ({
        url: `/timeslots/${slotId}/unbook`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slotId) => [
        { type: 'TimeSlot', id: slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Block
    blockSlot: builder.mutation<any, string>({
      query: (slotId) => ({
        url: `/timeslots/${slotId}/block`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slotId) => [
        { type: 'TimeSlot', id: slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Unblock
    unblockSlot: builder.mutation<any, string>({
      query: (slotId) => ({
        url: `/timeslots/${slotId}/unblock`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slotId) => [
        { type: 'TimeSlot', id: slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),

    // Update capacity
    updateSlotCapacity: builder.mutation<any, { slotId: string; capacity: number }>({
      query: ({ slotId, capacity }) => ({
        url: `/timeslots/${slotId}/capacity`,
        method: 'PUT',
        body: { newCapacity: capacity },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'TimeSlot', id: arg.slotId },
        { type: 'TimeSlot', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGenerateTimeSlotsMutation,
  useCreateTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useGetAllTimeSlotsQuery,
  useUpdateTimeSlotMutation,
  useBookSlotMutation,
  useUnbookSlotMutation,
  useBlockSlotMutation,
  useUnblockSlotMutation,
  useUpdateSlotCapacityMutation,
  useGetServiceSlotsByDateQuery
} = timeSlotApi;
