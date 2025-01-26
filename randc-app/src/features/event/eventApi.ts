// src/features/event/eventApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface EventPayload {
  _id?: string;
  tenant: string;
  type: 'BOOKING' | 'BREAK' | 'OTHER';
  title?: string;
  startTime: string;
  endTime: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: customBaseQuery,

  // 1) Declare the types we plan to invalidate
  tagTypes: ['Events'],

  endpoints: (builder) => ({
    // 2) Provide the “Events” tag from the list query
    listEventsByTenant: builder.query<EventPayload[], string>({
      query: (tenantId) => `/events/tenant/${tenantId}`,
      transformResponse: (response: { success: boolean; data: EventPayload[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              // Provide a tag for each returned event
              ...result.map((ev) => ({ type: 'Events' as const, id: ev._id })),
              // And an overall tag for the entire collection
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),

    // 3) “Create,” “Update,” “Delete” -> invalidates the same tags
    createEvent: builder.mutation<any, Partial<EventPayload>>({
      query: (body) => ({
        url: `/events`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }], // refetch the list
    }),

    updateEvent: builder.mutation<any, { eventId: string; data: Partial<EventPayload> }>({
      query: ({ eventId, data }) => ({
        url: `/events/${eventId}`,
        method: 'PUT',
        body: data,
      }),
      // Invalidate specifically the updated event + the list
      invalidatesTags: (result, error, arg) => [
        { type: 'Events', id: arg.eventId },
        { type: 'Events', id: 'LIST' },
      ],
    }),

    deleteEvent: builder.mutation<any, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Events', id: arg },
        { type: 'Events', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListEventsByTenantQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
