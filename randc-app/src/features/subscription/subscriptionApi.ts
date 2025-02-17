// src/features/subscription/subscriptionApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { Tenant } from '../../types/Tenant';

/**
 * Define or import a proper plan interface to replace "YourPlanType".
 */
export interface ISubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  features?: string[];
  isPublished?: boolean;
  stripePlanId?: string;
  createdAt?: string; // or Date
}

/** If your backend returns this shape for listPlans: */
interface PlanListResponse {
  success: boolean;
  plans: ISubscriptionPlan[];
}

/** If your backend returns this shape for single plan: */
interface SinglePlanResponse {
  success: boolean;
  plan: ISubscriptionPlan;
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Subscription'],

  endpoints: (builder) => ({
    // Existing subscription endpoints
    subscribeTenant: builder.mutation<
      { success: boolean; tenant: any },
      { planId: string }
    >({
      query: ({ planId }) => ({
        url: '/subscriptions/subscribe',
        method: 'POST',
        body: { planId },
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),

    cancelSubscription: builder.mutation<
      { success: boolean; tenant: any },
      void
    >({
      query: () => ({
        url: '/subscriptions/cancel',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),

    paymentSuccess: builder.mutation<
      { success: boolean; message: string },
      { reference: string }
    >({
      query: ({ reference }) => ({
        url: '/subscriptions/payment-success',
        method: 'POST',
        body: { reference },
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),

    paymentFailure: builder.mutation<
      { success: boolean; message: string },
      { reference: string }
    >({
      query: ({ reference }) => ({
        url: '/subscriptions/payment-failure',
        method: 'POST',
        body: { reference },
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),

    listTenantSubscriptions: builder.query<Tenant[], void>({
      query: () => '/subscriptions',
      transformResponse: (resp: { success: boolean; tenants: Tenant[] }) =>
        resp.tenants,
      providesTags: (result) =>
        result
          ? [
              ...result.map((tenant: Tenant) => ({
                type: 'Subscription' as const,
                id: tenant._id,
              })),
              { type: 'Subscription', id: 'LIST' },
            ]
          : [{ type: 'Subscription', id: 'LIST' }],
    }),

    getTenantSubscription: builder.query<any, string>({
      query: (tenantId) => `/subscriptions/${tenantId}`,
      transformResponse: (resp: { success: boolean; tenant: any }) =>
        resp.tenant,
      providesTags: (result, error, tenantId) =>
        result ? [{ type: 'Subscription', id: tenantId }] : [],
    }),

    // Stripe-based endpoints
    createCheckoutSession: builder.mutation<
      { url: string },
      { planId: string; tenantId: string }
    >({
      query: ({ planId, tenantId }) => ({
        url: '/stripe/checkout',
        method: 'POST',
        body: { planId, tenantId },
      }),
    }),

    getStripeSession: builder.query<any, string>({
      query: (sessionId) => `/stripe/session/${sessionId}`,
    }),

    // Example: listing plans from the same slice
    listPlans: builder.query<ISubscriptionPlan[], void>({
      query: () => '/subscription-plans',
      transformResponse: (resp: PlanListResponse) => resp.plans,
    }),

    confirmSubscription: builder.query<
    { success: boolean; message: string; payment?: any },
    string
  >({
    query: (sessionId) => `/stripe/confirm-subscription/${sessionId}`,
  }),

    // Example: get plan by ID
    getPlanById: builder.query<ISubscriptionPlan, string>({
      query: (planId) => `/subscription-plans/${planId}`,
      transformResponse: (resp: SinglePlanResponse) => resp.plan,
    }),
  }),
});

export const {
  useSubscribeTenantMutation,
  useCancelSubscriptionMutation,
  usePaymentSuccessMutation,
  usePaymentFailureMutation,
  useListTenantSubscriptionsQuery,
  useGetTenantSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useGetStripeSessionQuery,
  useListPlansQuery,
  useGetPlanByIdQuery,
  useConfirmSubscriptionQuery,
} = subscriptionApi;
