// src/features/bookings/bookingApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { Booking } from '../../types/Booking';

// Some simplified types
export interface SpecialRequests {
  hasPets?: boolean;
  numberOfRooms?: number;
  note?: string;
  address?: string;
  roomType?: string;
}



export interface BookingResponse {
  success: boolean;
  data: Booking;
  message?: string;
}

export interface BookingListResponse {
  success: boolean;
  data: Booking[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    // 1) List all bookings => GET /api/bookings
    listBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
      transformResponse: (response: BookingListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((bk) => ({ type: 'Booking' as const, id: bk._id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    // 2) Get single booking => GET /api/bookings/:bookingId
    getBookingById: builder.query<Booking, string>({
      query: (bookingId) => `/bookings/${bookingId}`,
      transformResponse: (response: BookingResponse) => response.data,
      providesTags: (result, error, arg) => [{ type: 'Booking', id: arg }],
    }),

    // 3) Create booking => POST /api/bookings
    createBooking: builder.mutation<
      Booking,
      {
        serviceId: string;
        timeSlotId?: string;
        notes?: string;
        nonUserEmail?: string;
        specialRequests?: SpecialRequests;
      }
    >({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    // 4) Assign staff => POST /api/bookings/:bookingId/assign-staff
    assignStaff: builder.mutation<Booking, { bookingId: string; staffId: string }>({
      query: ({ bookingId, staffId }) => ({
        url: `/bookings/${bookingId}/assign-staff`,
        method: 'POST',
        body: { staffId },
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 5) Update booking status => PUT /api/bookings/:bookingId/status
    updateBookingStatus: builder.mutation<Booking, { bookingId: string; status: BookingStatus }>({
      query: ({ bookingId, status }) => ({
        url: `/bookings/${bookingId}/status`,
        method: 'PUT',
        body: { status },
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 6) Cancel booking => PUT /api/bookings/:bookingId/cancel
    cancelBooking: builder.mutation<{ success: boolean; message: string }, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg }],
    }),

    // 7) Generic update => PUT /api/bookings/:bookingId
    updateBooking: builder.mutation<Booking, { bookingId: string; data: Partial<Booking> }>({
      query: ({ bookingId, data }) => ({
        url: `/bookings/${bookingId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 8) CREATE TENANT BOOKING => POST /api/bookings/tenant
    createTenantBooking: builder.mutation<
      Booking,
      {
        serviceId: string;
        timeSlotId?: string;
        notes?: string;
        nonUserEmail?: string;
        specialRequests?: SpecialRequests;
      }
    >({
      query: (body) => ({
        url: '/bookings/tenant/',
        method: 'POST',
        body,
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
  }),
});

export const {
  useListBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useCreateTenantBookingMutation,
  useAssignStaffMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useUpdateBookingMutation,
} = bookingApi;
