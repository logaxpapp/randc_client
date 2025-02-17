// src/features/subscriptionFeature/subscriptionFeatureApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * 1) Define your local interface for a subscription feature.
 *    Adjust fields if your actual feature differs.
 */
export interface SubscriptionFeature {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * This file calls your server's /api/features endpoints:
 * 
 *   POST    /api/features
 *   GET     /api/features
 *   GET     /api/features/:featureId
 *   PUT     /api/features/:featureId
 *   DELETE  /api/features/:featureId
 */
export const subscriptionFeatureApi = createApi({
  reducerPath: 'subscriptionFeatureApi',
  baseQuery: customBaseQuery,
  tagTypes: ['SubscriptionFeature'],
  endpoints: (builder) => ({

    /**
     * 1) createFeature => POST /api/features
     */
    createFeature: builder.mutation<
      SubscriptionFeature,
      { name: string; description?: string }
    >({
      query: (body) => ({
        url: '/features',
        method: 'POST',
        body, // { name, description }
      }),
      invalidatesTags: [{ type: 'SubscriptionFeature', id: 'LIST' }],
      transformResponse: (resp: { success: boolean; data: SubscriptionFeature }) => resp.data,
    }),

    /**
     * 2) listFeatures => GET /api/features
     */
    listFeatures: builder.query<SubscriptionFeature[], void>({
      query: () => '/features',
      transformResponse: (resp: { success: boolean; data: SubscriptionFeature[] }) =>
        resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((feature) => ({
                type: 'SubscriptionFeature' as const,
                id: feature._id,
              })),
              { type: 'SubscriptionFeature', id: 'LIST' },
            ]
          : [{ type: 'SubscriptionFeature', id: 'LIST' }],
    }),

    /**
     * 3) getFeatureById => GET /api/features/:featureId
     */
    getFeatureById: builder.query<SubscriptionFeature, string>({
      query: (featureId) => `/features/${featureId}`,
      transformResponse: (resp: { success: boolean; data: SubscriptionFeature }) =>
        resp.data,
      providesTags: (result, error, id) =>
        result ? [{ type: 'SubscriptionFeature', id }] : [],
    }),

    /**
     * 4) updateFeature => PUT /api/features/:featureId
     */
    updateFeature: builder.mutation<
      SubscriptionFeature,
      { featureId: string; data: Partial<SubscriptionFeature> }
    >({
      query: ({ featureId, data }) => ({
        url: `/features/${featureId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { featureId }) => [
        { type: 'SubscriptionFeature', id: featureId },
        { type: 'SubscriptionFeature', id: 'LIST' },
      ],
      transformResponse: (resp: { success: boolean; data: SubscriptionFeature }) => resp.data,
    }),

    /**
     * 5) deleteFeature => DELETE /api/features/:featureId
     */
    deleteFeature: builder.mutation<{ success: boolean; message: string }, string>({
      query: (featureId) => ({
        url: `/features/${featureId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, featureId) => [
        { type: 'SubscriptionFeature', id: featureId },
        { type: 'SubscriptionFeature', id: 'LIST' },
      ],
    }),
  }),
});

/**
 * Export the generated hooks for usage in functional components
 */
export const {
  useCreateFeatureMutation,
  useListFeaturesQuery,
  useGetFeatureByIdQuery,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = subscriptionFeatureApi;
