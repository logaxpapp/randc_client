// src/services/amenityApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { Amenity } from '../../types/Amenity';
import { customBaseQuery } from '../api/baseQuery';

export const amenityApi = createApi({
  reducerPath: 'amenityApi',
  baseQuery: customBaseQuery, // Assumes you've defined a custom base query (e.g., with baseUrl and headers)
  tagTypes: ['Amenity'],
  endpoints: (builder) => ({
    /**
     * 1) Create Amenity
     */
    createAmenity: builder.mutation<Amenity, Partial<Amenity>>({
      query: (body) => ({
        url: '/amenities',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Amenity', id: 'LIST' }],
    }),

    /**
     * 2) List Amenities
     */
    listAmenities: builder.query<Amenity[], void>({
      query: () => '/amenities',
      transformResponse: (response: { success: boolean; data: Amenity[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Amenity' as const, id: _id })),
              { type: 'Amenity', id: 'LIST' },
            ]
          : [{ type: 'Amenity', id: 'LIST' }],
    }),

    /**
     * 3) Get Amenity by ID
     */
    getAmenityById: builder.query<Amenity, string>({
      query: (amenityId) => `/amenities/${amenityId}`,
      transformResponse: (response: { success: boolean; data: Amenity }) => response.data,
      providesTags: (result, error, amenityId) => [{ type: 'Amenity', id: amenityId }],
    }),

    /**
     * 4) Update Amenity
     */
    updateAmenity: builder.mutation<Amenity, { amenityId: string; data: Partial<Amenity> }>({
      query: ({ amenityId, data }) => ({
        url: `/amenities/${amenityId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { amenityId }) => [
        { type: 'Amenity', id: amenityId },
        { type: 'Amenity', id: 'LIST' },
      ],
    }),

    /**
     * 5) Delete Amenity
     */
    deleteAmenity: builder.mutation<{ success: boolean }, string>({
      query: (amenityId) => ({
        url: `/amenities/${amenityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, amenityId) => [
        { type: 'Amenity', id: amenityId },
        { type: 'Amenity', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateAmenityMutation,
  useListAmenitiesQuery,
  useGetAmenityByIdQuery,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
} = amenityApi;
