// src/features/recommended/recommendedApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/** The recommended item interface */
export interface RecommendedItem {
  _id: string;
  tenant: string;       // tenant _id
  name: string;
  address?: string;
  image?: string;
  shortDesc?: string;
  rating: number;
  reviewCount: number;
  isExpired: boolean;
  isPublished: boolean;
  recommendedByPlan?: string; // plan _id
  createdAt: string;
  updatedAt: string;
  hasPayment?: boolean;  // optional if you want to show payment status
}

/**
 * We also define a server route for checkout:
 * e.g. POST /api/recommended/:id/checkout
 * or POST /api/stripe/recommended-checkout
 * that returns { success: boolean, url: string }
 */
interface CreateCheckoutResp {
  success: boolean;
  url: string;
}

export const recommendedApi = createApi({
  reducerPath: 'recommendedApi',
  baseQuery: customBaseQuery,
  tagTypes: ['RecommendedItem'],
  endpoints: (builder) => ({

    // 1) createRecommended => POST /api/recommended
    createRecommended: builder.mutation<
      RecommendedItem,
      {
        tenantId: string;
        name: string;
        address?: string;
        image?: string;
        shortDesc?: string;
        recommendedByPlan?: string;
      }
    >({
      query: (body) => ({
        url: '/recommended',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RecommendedItem', id: 'LIST' }],
    }),

    // 2) listRecommended => GET /api/recommended
    listRecommended: builder.query<
      RecommendedItem[],
      { tenantId?: string; page?: number; limit?: number }
    >({
      query: ({ tenantId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (tenantId) params.set('tenantId', tenantId);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/recommended?${params.toString()}`;
      },
      transformResponse: (resp: { success: boolean; data: RecommendedItem[] }) => resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'RecommendedItem' as const, id: item._id })),
              { type: 'RecommendedItem', id: 'LIST' },
            ]
          : [{ type: 'RecommendedItem', id: 'LIST' }],
    }),

    // 3) getRecommendedById => GET /api/recommended/:id
    getRecommendedById: builder.query<RecommendedItem, string>({
      query: (id) => `/recommended/${id}`,
      transformResponse: (resp: { success: boolean; data: RecommendedItem }) => resp.data,
      providesTags: (result, error, id) =>
        result ? [{ type: 'RecommendedItem', id }] : [],
    }),

    // 4) updateRecommended => PATCH /api/recommended/:id
    updateRecommended: builder.mutation<
      RecommendedItem,
      { id: string; data: Partial<RecommendedItem> }
    >({
      query: ({ id, data }) => ({
        url: `/recommended/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecommendedItem', id },
        { type: 'RecommendedItem', id: 'LIST' },
      ],
    }),

    // 5) deleteRecommended => DELETE /api/recommended/:id
    deleteRecommended: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/recommended/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'RecommendedItem', id },
        { type: 'RecommendedItem', id: 'LIST' },
      ],
    }),

    // 6) publishRecommended => PATCH /api/recommended/:id/publish
    publishRecommended: builder.mutation<
      RecommendedItem,
      { id: string; publish: boolean }
    >({
      query: ({ id, publish }) => ({
        url: `/recommended/${id}/publish`,
        method: 'PATCH',
        body: { publish },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecommendedItem', id },
        { type: 'RecommendedItem', id: 'LIST' },
      ],
    }),

    // 7) markPaid => PATCH /api/recommended/:id/mark-paid (Admin or Webhook)
    markPaid: builder.mutation<RecommendedItem, { id: string }>({
      query: ({ id }) => ({
        url: `/recommended/${id}/mark-paid`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecommendedItem', id },
        { type: 'RecommendedItem', id: 'LIST' },
      ],
    }),

    // 8) createRecommendedCheckoutSession => POST /api/recommended/:id/checkout (Stripe)
    //    returns { success: boolean; url: string }
    createRecommendedCheckoutSession: builder.mutation<
      CreateCheckoutResp,
      { recommendedId: string; amount?: number }
    >({
      query: ({ recommendedId, amount }) => ({
        url: `/recommended/${recommendedId}/checkout`,
        method: 'POST',
        // If your route needs `amount` or other data
        body: amount ? { amount } : {},
      }),
    }),
  }),
});

export const {
  useCreateRecommendedMutation,
  useListRecommendedQuery,
  useGetRecommendedByIdQuery,
  useUpdateRecommendedMutation,
  useDeleteRecommendedMutation,
  usePublishRecommendedMutation,
  useMarkPaidMutation,

  // The new Stripe session:
  useCreateRecommendedCheckoutSessionMutation,
} = recommendedApi;
