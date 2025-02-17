import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// Basic shape of promo
export interface PromoPayload {
  _id?: string;
  code: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  usageLimit?: number;
  usedCount?: number;
  expiration?: string; // ISO date
  appliesToAllServices: boolean;
  applicableServices?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const promoApi = createApi({
  reducerPath: 'promoApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Promo'],
  endpoints: (builder) => ({
    listPromos: builder.query<PromoPayload[], void>({
      query: () => '/promos', // tenant is handled by server middleware
      transformResponse: (response: { success: boolean; data: PromoPayload[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((promo) => ({ type: 'Promo' as const, id: promo._id })),
              { type: 'Promo', id: 'LIST' },
            ]
          : [{ type: 'Promo', id: 'LIST' }],
    }),

    getPromo: builder.query<PromoPayload, string>({
      query: (promoId) => `/promos/${promoId}`,
      transformResponse: (response: { success: boolean; data: PromoPayload }) => response.data,
      providesTags: (result, error, arg) => [{ type: 'Promo', id: arg }],
    }),

    createPromo: builder.mutation<PromoPayload, Partial<PromoPayload>>({
      query: (body) => ({
        url: '/promos',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: PromoPayload }) => response.data,
      invalidatesTags: [{ type: 'Promo', id: 'LIST' }],
    }),

    updatePromo: builder.mutation<PromoPayload, { promoId: string; body: Partial<PromoPayload> }>({
      query: ({ promoId, body }) => ({
        url: `/promos/${promoId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { success: boolean; data: PromoPayload }) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Promo', id: arg.promoId },
        { type: 'Promo', id: 'LIST' },
      ],
    }),

    deletePromo: builder.mutation<{ message: string }, string>({
      query: (promoId) => ({
        url: `/promos/${promoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Promo', id: arg },
        { type: 'Promo', id: 'LIST' },
      ],
    }),

    validatePromo: builder.query<
      { code: string; discountType: string; discountValue: number },
      { code: string; serviceId: string }
    >({
      query: ({ code, serviceId }) => `/promos/validate?code=${code}&serviceId=${serviceId}`,
    }),
  }),
});

export const {
  useListPromosQuery,
  useGetPromoQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
  useValidatePromoQuery,
  useLazyValidatePromoQuery,
} = promoApi;
