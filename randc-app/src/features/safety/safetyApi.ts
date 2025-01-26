// src/features/safety/safetyApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// The core Safety interface
export interface Safety {
  _id: string;
  name: string;
  description?: string;
  createdBy?: string; // or { _id: string; ... } if populated
  createdAt: string;
}

// For typical API responses
interface SafetyListResponse {
  success: boolean;
  data: Safety[];
}
interface SafetySingleResponse {
  success: boolean;
  data: Safety;
}

export const safetyApi = createApi({
  reducerPath: 'safetyApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Safety'],
  endpoints: (builder) => ({
    // 1) List all safety items
    listSafety: builder.query<Safety[], void>({
      query: () => '/safety',  // GET /api/safety
      transformResponse: (response: SafetyListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: 'Safety' as const, id: s._id })),
              { type: 'Safety', id: 'LIST' },
            ]
          : [{ type: 'Safety', id: 'LIST' }],
    }),

    // 2) Get single safety by id
    getSafetyById: builder.query<Safety, string>({
      query: (id) => `/safety/${id}`, // GET /api/safety/:safetyId
      transformResponse: (response: SafetySingleResponse) => response.data,
      providesTags: (result, error, arg) => [{ type: 'Safety', id: arg }],
    }),

    // 3) Create safety
    createSafety: builder.mutation<Safety, Partial<Safety>>({
      query: (body) => ({
        url: '/safety',  // POST /api/safety
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Safety', id: 'LIST' }],
    }),

    // 4) Update safety
    updateSafety: builder.mutation<Safety, { id: string; data: Partial<Safety> }>({
      query: ({ id, data }) => ({
        url: `/safety/${id}`, // PUT /api/safety/:safetyId
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Safety', id: arg.id },
        { type: 'Safety', id: 'LIST' },
      ],
    }),

    // 5) Delete safety
    deleteSafety: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/safety/${id}`, // DELETE /api/safety/:safetyId
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Safety', id: arg },
        { type: 'Safety', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListSafetyQuery,
  useGetSafetyByIdQuery,
  useCreateSafetyMutation,
  useUpdateSafetyMutation,
  useDeleteSafetyMutation,
} = safetyApi;
