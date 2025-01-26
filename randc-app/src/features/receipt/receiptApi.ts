import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface IReceipt {
  _id: string;
  tenant: string;
  booking: string;
  amount: number;
  currency?: string;
  lineItems?: { description: string; price: number; quantity: number }[];
  tenantSignatureURL?: string;
  customerSignatureURL?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface TenantReceiptsResponse {
  success: boolean;
  data?: {
    receipts: IReceipt[];
    total: number;
  };
}

// For create
interface CreateReceiptRequest {

  booking: string;
  amount: number;
  currency?: string;
  lineItems?: { description: string; price: number; quantity: number }[];
}

export const receiptApi = createApi({
  reducerPath: 'receiptApi',
  baseQuery: customBaseQuery, // e.g. fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' })
  tagTypes: ['Receipt'],
  endpoints: (builder) => ({
    // Create a brand new receipt with a custom price from the front end
    createReceipt: builder.mutation<IReceipt, CreateReceiptRequest>({
      query: (body) => ({
        url: '/receipts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Receipt'],
    }),

    getReceiptById: builder.query<IReceipt, string>({
      query: (receiptId) => `/receipts/${receiptId}`,
      providesTags: (result, error, id) => [{ type: 'Receipt', id }],
    }),

    updateReceipt: builder.mutation<IReceipt, { receiptId: string; updates: Partial<IReceipt> }>({
      query: ({ receiptId, updates }) => ({
        url: `/receipts/${receiptId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Receipt', id: arg.receiptId }],
    }),

    generateReceiptPDF: builder.mutation<{ pdfUrl: string }, string>({
      query: (receiptId) => ({
        url: `/receipts/${receiptId}/generate-pdf`,
        method: 'POST',
      }),
      // The backend is returning { success: true, pdfUrl: '/uploads/...' }
      // If you stored it under data, you'd do transformResponse here. But we flattened it, so no need.
      invalidatesTags: ['Receipt'],
    }),

    listTenantReceipts: builder.query<{ receipts: IReceipt[]; total: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/receipts/tenant/list?page=${page}&limit=${limit}`,
      transformResponse: (response: TenantReceiptsResponse) => {
        if (!response.success || !response.data) {
          return { receipts: [], total: 0 };
        }
        return response.data;
      },
      providesTags: (result) =>
        result && result.receipts
          ? [
              ...result.receipts.map((r) => ({ type: 'Receipt' as const, id: r._id })),
              { type: 'Receipt', id: 'LIST' },
            ]
          : [{ type: 'Receipt', id: 'LIST' }],
    }),

    reGenerateReceipt: builder.mutation<{ data: IReceipt }, string>({
      query: (bookingId) => ({
        url: `/receipts/regenerate/${bookingId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Receipt'],
    }),
  }),
});

export const {
  useCreateReceiptMutation,
  useGetReceiptByIdQuery,
  useUpdateReceiptMutation,
  useGenerateReceiptPDFMutation,
  useListTenantReceiptsQuery,
  useReGenerateReceiptMutation,
} = receiptApi;
