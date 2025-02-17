// src/features/recommended/recommendedPlanApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * Client-side interface for recommended plan (similar to subscription plan).
 */
export interface RecommendedPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  stripePlanId?: string;  // from Stripe
  isPublished: boolean;
  createdAt: string;  // date string
  updatedAt: string;  // date string
}

export const recommendedPlanApi = createApi({
  reducerPath: 'recommendedPlanApi',
  baseQuery: customBaseQuery,
  tagTypes: ['RecommendedPlan'],
  endpoints: (builder) => ({

    /**
     * 1) createRecommendedPlan => POST /api/recommended/plans
     */
    createRecommendedPlan: builder.mutation<
      RecommendedPlan,
      { name: string; price: number; description?: string; features?: string[] }
    >({
      query: (body) => ({
        url: '/recommended-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RecommendedPlan', id: 'LIST' }],
    }),

    /**
     * 2) listRecommendedPlans => GET /api/recommended/plans
     */
    listRecommendedPlans: builder.query<RecommendedPlan[], void>({
      query: () => '/recommended-plans',
      transformResponse: (resp: { success: boolean; data: RecommendedPlan[] }) =>
        resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((plan) => ({ type: 'RecommendedPlan' as const, id: plan._id })),
              { type: 'RecommendedPlan', id: 'LIST' },
            ]
          : [{ type: 'RecommendedPlan', id: 'LIST' }],
    }),

    /**
     * 3) getRecommendedPlanById => GET /api/recommended/plans/:planId
     */
    getRecommendedPlanById: builder.query<RecommendedPlan, string>({
      query: (planId) => `/recommended-plans/${planId}`,
      transformResponse: (resp: { success: boolean; data: RecommendedPlan }) =>
        resp.data,
      providesTags: (result, error, planId) =>
        result ? [{ type: 'RecommendedPlan', id: planId }] : [],
    }),

    /**
     * 4) updateRecommendedPlan => PATCH /api/recommended/plans/:planId
     */
    updateRecommendedPlan: builder.mutation<
      RecommendedPlan,
      { planId: string; data: Partial<RecommendedPlan> }
    >({
      query: ({ planId, data }) => ({
        url: `/recommended-plans/${planId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'RecommendedPlan', id: planId },
        { type: 'RecommendedPlan', id: 'LIST' },
      ],
    }),

    /**
     * 5) deleteRecommendedPlan => DELETE /api/recommended/plans/:planId
     */
    deleteRecommendedPlan: builder.mutation<{ success: boolean; message: string }, string>({
      query: (planId) => ({
        url: `/recommended-plans/${planId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, planId) => [
        { type: 'RecommendedPlan', id: planId },
        { type: 'RecommendedPlan', id: 'LIST' },
      ],
    }),

    /**
     * 6) publishRecommendedPlan => PATCH /api/recommended/plans/:planId/publish
     * Body: { publish: boolean }
     */
    publishRecommendedPlan: builder.mutation<
      RecommendedPlan,
      { planId: string; publish: boolean }
    >({
      query: ({ planId, publish }) => ({
        url: `/recommended-plans/${planId}/publish`,
        method: 'PATCH',
        body: { publish },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'RecommendedPlan', id: planId },
        { type: 'RecommendedPlan', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateRecommendedPlanMutation,
  useListRecommendedPlansQuery,
  useGetRecommendedPlanByIdQuery,
  useUpdateRecommendedPlanMutation,
  useDeleteRecommendedPlanMutation,
  usePublishRecommendedPlanMutation,
} = recommendedPlanApi;
