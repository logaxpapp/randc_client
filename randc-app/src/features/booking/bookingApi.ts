// src/features/bookings/bookingApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import {
  Booking,
  SpecialRequests,
  BookingResponse,
  BookingListResponse,
  BookingStatus,
} from '../../types/Booking';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────
    // 1) LIST all tenant bookings => GET /api/bookings
    // ─────────────────────────────────────────────────────
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

    // 2) GET single => /api/bookings/:bookingId
    getBookingById: builder.query<Booking, string>({
      query: (bookingId) => `/bookings/${bookingId}`,
      transformResponse: (response: BookingResponse) => response.data,
      providesTags: (result, error, arg) => [{ type: 'Booking', id: arg }],
    }),

    // 3) CREATE booking => POST /api/bookings
    createBooking: builder.mutation<
          Booking,
          {
            serviceId: string;
            timeSlotId?: string;
            notes?: string;
            nonUserEmail?: string;
            specialRequests?: SpecialRequests;
            seeker?: string; // CRUCIAL
            customerId?: string;
          }
        >({
          query: (body) => {
            console.log('RTK "createBooking" sending body:', body); // log
            return {
              url: '/bookings',
              method: 'POST',
              body,
            };
          },
          transformResponse: (response: BookingResponse) => response.data,
          invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
        }),

    // 4) ASSIGN staff => POST /api/bookings/:bookingId/assign-staff
    assignStaff: builder.mutation<Booking, { bookingId: string; staffId: string }>({
      query: ({ bookingId, staffId }) => ({
        url: `/bookings/${bookingId}/assign-staff`,
        method: 'POST',
        body: { staffId },
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 5) UPDATE status => PUT /api/bookings/:bookingId/status
    updateBookingStatus: builder.mutation<Booking, { bookingId: string; status: BookingStatus }>({
      query: ({ bookingId, status }) => ({
        url: `/bookings/${bookingId}/status`,
        method: 'PUT',
        body: { status },
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 6) CANCEL => PUT /api/bookings/:bookingId/cancel
    cancelBooking: builder.mutation<{ success: boolean; message: string }, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg }],
    }),

    // 7) GENERIC update => PUT /api/bookings/:bookingId
    updateBooking: builder.mutation<Booking, { bookingId: string; data: Partial<Booking> }>({
      query: ({ bookingId, data }) => ({
        url: `/bookings/${bookingId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.bookingId }],
    }),

    // 8) CREATE tenant booking => POST /api/bookings/tenant
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

    // ─────────────────────────────────────────────────────
    // 9) GET MY bookings => GET /api/bookings/mine
    // ─────────────────────────────────────────────────────
    getMyBookings: builder.query<Booking[], void>({
      query: () => '/bookings/mine',
      transformResponse: (response: BookingListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((bk) => ({ type: 'Booking' as const, id: bk._id })),
              { type: 'Booking', id: 'MINE' },
            ]
          : [{ type: 'Booking', id: 'MINE' }],
    }),

    // 10) UPDATE MY booking => PUT /api/bookings/mine/:bookingId
    updateMyBooking: builder.mutation<Booking, { bookingId: string; data: Partial<Booking> }>({
      query: ({ bookingId, data }) => ({
        url: `/bookings/mine/${bookingId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BookingResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Booking', id: arg.bookingId },
        { type: 'Booking', id: 'MINE' },
      ],
    }),

    // 11) CANCEL MY booking => PUT /api/bookings/mine/:bookingId/cancel
    cancelMyBooking: builder.mutation<{ success: boolean; message: string; data?: Booking }, string>(
      {
        query: (bookingId) => ({
          url: `/bookings/mine/${bookingId}/cancel`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Booking', id: arg },
          { type: 'Booking', id: 'MINE' },
        ],
      }
    ),
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

  // New hooks for "my" bookings:
  useGetMyBookingsQuery,
  useUpdateMyBookingMutation,
  useCancelMyBookingMutation,
} = bookingApi;
