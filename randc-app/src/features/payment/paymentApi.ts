import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * Covers:
 *  - POST /payments/initialize
 *  - POST /payments/paystack-webhook
 *  - POST /payments/stripe-webhook  (with raw body if needed)
 */
export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // 1) Initialize Payment
    initializePayment: builder.mutation<any, { body: any }>({
      query: ({ body }) => ({
        url: '/payments/initialize',
        method: 'POST',
        body,
      }),
    }),

    // 2) Paystack Webhook
    paystackWebhook: builder.mutation<any, any>({
      query: (payload) => ({
        url: '/payments/paystack-webhook',
        method: 'POST',
        body: payload,
      }),
    }),

    // 3) Stripe Webhook
    stripeWebhook: builder.mutation<any, any>({
      query: (payload) => ({
        url: '/payments/stripe-webhook',
        method: 'POST',
        // The raw body aspect typically requires express.raw() on the server side,
        // but from the client side, you can just pass JSON or an empty body
        body: payload,
      }),
    }),
  }),
});

// Hooks
export const {
  useInitializePaymentMutation,
  usePaystackWebhookMutation,
  useStripeWebhookMutation,
} = paymentApi;
