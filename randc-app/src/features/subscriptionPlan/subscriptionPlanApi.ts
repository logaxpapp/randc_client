// src/features/subscriptionPlan/subscriptionPlanApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * Client-side interface for subscription plans.
 * 'published' is a quick toggle, 'publishedAt' is the date or null.
 */
export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  stripePlanId?: string;
  paystackPlanId?: string;
  createdAt: string;      // ISO string

  // Quick boolean toggle
  published: boolean;
  // Date or null if unpublished. We'll store as string here, but you can convert to Date if you like.
  publishedAt?: string | null; 
}

export const subscriptionPlanApi = createApi({
  reducerPath: 'subscriptionPlanApi',
  baseQuery: customBaseQuery,
  tagTypes: ['SubscriptionPlan'],
  endpoints: (builder) => ({
    /**
     * 1) Create a plan
     */
    createPlan: builder.mutation<
      SubscriptionPlan,
      { name: string; price: number; description?: string; features?: string[] }
    >({
      query: (body) => ({
        url: '/subscription-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SubscriptionPlan', id: 'LIST' }],
    }),

    /**
     * 2) List all plans
     */
    listPlans: builder.query<SubscriptionPlan[], void>({
      query: () => '/subscription-plans',
      transformResponse: (response: { success: boolean; plans: SubscriptionPlan[] }) =>
        response.plans,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'SubscriptionPlan' as const, id: _id })),
              { type: 'SubscriptionPlan', id: 'LIST' },
            ]
          : [{ type: 'SubscriptionPlan', id: 'LIST' }],
    }),

    /**
     * 3) Get a plan by ID
     */
    getPlanById: builder.query<SubscriptionPlan, string>({
      query: (planId) => `/subscription-plans/${planId}`,
      transformResponse: (response: { success: boolean; plan: SubscriptionPlan }) =>
        response.plan,
      providesTags: (result, error, planId) =>
        result ? [{ type: 'SubscriptionPlan', id: planId }] : [],
    }),

    /**
     * 4) Update plan (e.g. name, price, description)
     */
    updatePlan: builder.mutation<
      SubscriptionPlan,
      { planId: string; data: Partial<SubscriptionPlan> }
    >({
      query: ({ planId, data }) => ({
        url: `/subscription-plans/${planId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'SubscriptionPlan', id: planId },
        { type: 'SubscriptionPlan', id: 'LIST' },
      ],
    }),

    /**
     * 5) Delete a plan
     */
    deletePlan: builder.mutation<{ success: boolean; message: string }, string>({
      query: (planId) => ({
        url: `/subscription-plans/${planId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, planId) => [
        { type: 'SubscriptionPlan', id: planId },
        { type: 'SubscriptionPlan', id: 'LIST' },
      ],
    }),

    /**
     * 6) Add feature
     */
    addFeature: builder.mutation<
      SubscriptionPlan,
      { planId: string; feature: string }
    >({
      query: ({ planId, feature }) => ({
        url: `/subscription-plans/${planId}/add-feature`,
        method: 'PUT',
        body: { feature },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'SubscriptionPlan', id: planId },
      ],
    }),

    /**
     * 7) Remove feature
     */
    removeFeature: builder.mutation<
      SubscriptionPlan,
      { planId: string; feature: string }
    >({
      query: ({ planId, feature }) => ({
        url: `/subscription-plans/${planId}/remove-feature`,
        method: 'PUT',
        body: { feature },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'SubscriptionPlan', id: planId },
      ],
    }),

    /**
     * 8) Publish or unpublish plan
     *    - Pass { planId, publish } in the body
     */
    publishPlan: builder.mutation<
      SubscriptionPlan,
      { planId: string; publish: boolean }
    >({
      query: ({ planId, publish }) => ({
        url: `/subscription-plans/${planId}/publish`,
        method: 'PUT',
        body: { publish },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'SubscriptionPlan', id: planId },
        { type: 'SubscriptionPlan', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreatePlanMutation,
  useListPlansQuery,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useAddFeatureMutation,
  useRemoveFeatureMutation,
  // The new one:
  usePublishPlanMutation,
} = subscriptionPlanApi;
