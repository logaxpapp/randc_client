// src/features/review/reviewApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import {
  Review,
  ReviewResponse,
  CreateReviewRequest,
  ReplyReviewRequest,
  ListReviewsParams,
  ApproveReviewRequest,
} from '../../types/Review';

/** For advanced tenant listing: pagination, filters, etc. */
export interface ListTenantReviewsParams {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  maxRating?: number;
  showUnpublished?: boolean;
}

/** Server response shape for listing reviews with pagination. */
interface PaginatedReviewListResponse {
  reviews: Review[];
  totalCount: number; // total matching reviews for pagination
}

/** Simple response shape if server returns { success, data: Review[] } or similar. */
interface SimpleReviewListResponse {
  success: boolean;
  data: Review[];
}

/** Single Review or array of Reviews. Used in transformResponse. */
interface SingleReviewResponse {
  success: boolean;
  data: Review;
}
interface MultiReviewResponse {
  success: boolean;
  data: Review[];
}

/** For 'service' listing if no pagination is needed. */
interface ReviewListResponse {
  success: boolean;
  data: Review[];
}

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Review'],
  endpoints: (builder) => ({

    // 1) Create a new review
    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ReviewResponse) => response.data,
      invalidatesTags: ['Review'],
    }),

    // 2) Reply to a review
    replyToReview: builder.mutation<Review, ReplyReviewRequest>({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: 'PATCH',  // or PATCH
        body: { reply },
      }),
      transformResponse: (response: ReviewResponse) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Review', id: arg.reviewId }],
    }),

    // 3) Approve/publish a hidden review
    approveReview: builder.mutation<Review, ApproveReviewRequest>({
      query: ({ reviewId }) => ({
        url: `/reviews/${reviewId}/approve`,
        method: 'POST',
      }),
      transformResponse: (response: ReviewResponse) => response.data,
      invalidatesTags: ['Review'],
    }),

    // 4) List reviews for a service (no pagination, just fetch all published)
    listReviewsForService: builder.query<Review[], ListReviewsParams>({
      query: ({ serviceId }) => `/reviews/service/${serviceId}`,
      transformResponse: (response: ReviewListResponse) => response.data,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((rev) => ({ type: 'Review' as const, id: rev._id })),
              { type: 'Review', id: `SERVICE-${arg.serviceId}` },
            ]
          : [{ type: 'Review', id: `SERVICE-${arg.serviceId}` }],
    }),

    // 5) List reviews for a tenant, with advanced query (pagination, search, rating, etc.)
    listReviewsByTenant: builder.query<{ reviews: Review[]; totalCount: number }, ListTenantReviewsParams>({
      query: ({
        tenantId,
        page = 1,
        limit = 10,
        search = '',
        minRating = 1,
        maxRating = 5,
        showUnpublished = true,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search,
          minRating: String(minRating),
          maxRating: String(maxRating),
          showUnpublished: String(showUnpublished),
        });
        return `/reviews/tenant/${tenantId}?${params.toString()}`;
      },
      transformResponse: (response: { success: boolean; data: PaginatedReviewListResponse }) => {
        // The server returns { success: true, data: { reviews, totalCount } }
        return response.data; // => { reviews, totalCount }
      },
      providesTags: ['Review'],
    }),

  }),
});

export const {
  // Hooks for each endpoint
  useCreateReviewMutation,
  useReplyToReviewMutation,
  useApproveReviewMutation,
  useListReviewsForServiceQuery,
  useListReviewsByTenantQuery,
} = reviewApi;
