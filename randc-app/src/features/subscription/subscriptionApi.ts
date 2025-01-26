// src/features/subscription/subscriptionApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import { Tenant } from '../../types/Tenant';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Subscription'], 

  endpoints: (builder) => ({
   
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
      void // no arguments needed in body
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
      transformResponse: (resp: { success: boolean; tenants: Tenant[] }) => resp.tenants,
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
      transformResponse: (resp: { success: boolean; tenant: any }) => resp.tenant,
      providesTags: (result, error, tenantId) =>
        result ? [{ type: 'Subscription', id: tenantId }] : [],
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
} = subscriptionApi;
