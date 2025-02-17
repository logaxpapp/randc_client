// src/features/subscriptionPlan/subscriptionPlanApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { SubscriptionFeature } from '../subscriptionFeature/subscriptionFeatureApi';

/**
 * Interface for country-specific pricing.
 */
export interface CountryPricing {
  countryCode: string; // e.g. "US", "NG", "CA"
  currency: string;    // e.g. "USD", "NGN", "CAD"
  price: number;       // price in local currency
}

/**
 * Client-side interface for subscription plans.
 */
export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  features: SubscriptionFeature[];
  stripePlanId?: string;
  paystackPlanId?: string;
  createdAt: string; // ISO string

  published: boolean;
  publishedAt?: string | null;

  countryPricing: CountryPricing[];
}

/**
 * Response shape for getTenantPriceForPlan
 */
export interface TenantPriceResponse {
  success: boolean;
  price: number;
  currency: string;
  planName: string;
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
      {
        name: string;
        price: number;
        description?: string;
        features?: string[];
        countryPricing?: CountryPricing[];
      }
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
     * 4) Update plan
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
      { planId: string; featureId: string }
    >({
      query: ({ planId, featureId }) => ({
        url: `/subscription-plans/${planId}/add-feature`,
        method: 'PUT',
        body: { featureId },
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
     */
    publishPlan: builder.mutation<
      SubscriptionPlan,
      { planId: string; publish: boolean }
    >({
      query: ({ planId, publish }) => ({
        url: `/subscription-plans/${planId}/publish`,
        method: 'PATCH',
        body: { publish },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'SubscriptionPlan', id: planId },
        { type: 'SubscriptionPlan', id: 'LIST' },
      ],
    }),

    /**
     * 9) Get tenant-specific price for a plan
     *    GET /subscription-plans/:planId/tenant-price
     */
    getTenantPriceForPlan: builder.query<TenantPriceResponse, string>({
      query: (planId) => `/subscription-plans/${planId}/tenant-price`,
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
  usePublishPlanMutation,

  // The new one:
  useGetTenantPriceForPlanQuery,
} = subscriptionPlanApi;
