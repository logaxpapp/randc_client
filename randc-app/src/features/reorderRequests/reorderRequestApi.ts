// src/features/reorderRequests/reorderRequestApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// ---------------- Reorder Request Interface
export interface IReorderRequest {
  _id: string;
  tenant: string;
  supply: string | {
    _id: string;
    name: string;
    quantity: number;
  };
  requestedDate: string;
  quantityRequested: number;
  quantityReceived?: number;
  discrepancyReason?: string;
  status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELED' | 'PARTIAL';
  isClosed?: boolean;
  createdBy?: string | {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ReorderRequestListResponse {
  success: boolean;
  data: IReorderRequest[];
}

interface ReorderRequestSingleResponse {
  success: boolean;
  data: IReorderRequest;
}

// For partial receiving
export interface ReceiveReorderItemsParams {
  requestId: string;
  quantityReceived: number;
  discrepancyReason?: string;
  finalize?: boolean;
}

export const reorderRequestApi = createApi({
  reducerPath: 'reorderRequestApi',
  baseQuery: customBaseQuery,
  tagTypes: ['ReorderRequest'],
  endpoints: (builder) => ({
    // 1) List
    listReorderRequests: builder.query<IReorderRequest[], void>({
      query: () => '/reorders',
      transformResponse: (response: ReorderRequestListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'ReorderRequest' as const, id: r._id })),
              { type: 'ReorderRequest', id: 'LIST' },
            ]
          : [{ type: 'ReorderRequest', id: 'LIST' }],
    }),

    // 2) Get by ID
    getReorderRequestById: builder.query<IReorderRequest, string>({
      query: (requestId) => `/reorders/${requestId}`,
      transformResponse: (response: ReorderRequestSingleResponse) => response.data,
      providesTags: (result, error, id) => [{ type: 'ReorderRequest', id }],
    }),

    // 3) Create reorder request
    createReorderRequest: builder.mutation<IReorderRequest, { supplyId: string; quantityRequested: number }>({
      query: (body) => ({
        url: '/reorders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ReorderRequest', id: 'LIST' }],
    }),

    // 4) Update reorder request status
    updateReorderRequestStatus: builder.mutation<IReorderRequest, { requestId: string; status: string }>({
      query: ({ requestId, status }) => ({
        url: `/reorders/${requestId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ReorderRequest', id: arg.requestId },
        { type: 'ReorderRequest', id: 'LIST' },
      ],
    }),

    // 5) Receive items (partial or full)
    receiveReorderItems: builder.mutation<IReorderRequest, ReceiveReorderItemsParams>({
      query: ({ requestId, ...body }) => ({
        url: `/reorders/${requestId}/receive`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ReorderRequest', id: arg.requestId },
        { type: 'ReorderRequest', id: 'LIST' },
      ],
    }),

    // 6) Delete reorder request
    deleteReorderRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({
        url: `/reorders/${requestId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ReorderRequest', id: arg },
        { type: 'ReorderRequest', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListReorderRequestsQuery,
  useGetReorderRequestByIdQuery,
  useCreateReorderRequestMutation,
  useUpdateReorderRequestStatusMutation,
  useDeleteReorderRequestMutation,
  useReceiveReorderItemsMutation, 
} = reorderRequestApi;
