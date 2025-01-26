// src/features/service/serviceApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery'; // or fetchBaseQuery({ baseUrl: '/api' })

export interface ServicePayload {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive?: boolean;
  createdAt?: string;
  images: string[];
  
  // New fields:
  category?: string;               // main category ID
  subcategories?: string[];        // array of subcategory IDs
}

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: customBaseQuery, // or fetchBaseQuery({ baseUrl: '/api' })
  tagTypes: ['Service'],

  endpoints: (builder) => ({
    // CREATE
    createService: builder.mutation<ServicePayload, Partial<ServicePayload>>({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: ServicePayload }) => {
        return response.data;
      },
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),

    // LIST
    listServices: builder.query<ServicePayload[], void>({
      query: () => '/services',
      transformResponse: (response: { success: boolean; data: ServicePayload[] }) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((srv) => ({ type: 'Service' as const, id: srv._id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),

    // GET BY ID
    getServiceById: builder.query<ServicePayload, string>({
      query: (serviceId) => `/services/${serviceId}`,
      transformResponse: (response: { success: boolean; data: ServicePayload }) => response.data,
      providesTags: (result, error, serviceId) =>
        result ? [{ type: 'Service', id: serviceId }] : [],
    }),

    // UPDATE
    updateService: builder.mutation<
      ServicePayload,
      { serviceId: string; body: Partial<ServicePayload> }
    >({
      query: ({ serviceId, body }) => ({
        url: `/services/${serviceId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { success: boolean; data: ServicePayload }) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Service', id: arg.serviceId },
        { type: 'Service', id: 'LIST' },
      ],
    }),

    // DELETE
    deleteService: builder.mutation<void, string>({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, serviceId) => [
        { type: 'Service', id: serviceId },
        { type: 'Service', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useListServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
