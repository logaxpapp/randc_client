// src/features/inventory/inventoryApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// ---------------- Base Supply Interface (unpopulated userId)
interface Supply {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  unitOfMeasure: string;
  threshold: number;
  vendorName?: string;
  vendorContact?: string;
  unitCost?: number;
  totalCost?: number;
  expirationDate?: string;
  location?: string;
  autoReorder?: boolean;
  usageLogs: {
    date: string;
    quantityUsed: number;
    reason?: string;
    userId?: string;  // stored as a string if not populated
  }[];
  createdAt: string;
  updatedAt: string;
}

// For standard GET /supplies
interface SupplyListResponse {
  success: boolean;
  data: Supply[];
}

interface SupplyResponse {
  success: boolean;
  data: Supply;
}

// For record usage
interface RecordUsageParams {
  supplyId: string;
  quantityUsed: number;
  reason?: string;
  userId?: string;
}

// ---------------- "Populated" version of usageLogs
type SupplyWithUsage = Omit<Supply, 'usageLogs'> & {
  usageLogs: {
    date: string;
    quantityUsed: number;
    reason?: string;
    userId?: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  }[];
};

// For GET /supplies/with-usage
interface SupplyWithUsageResponse {
  success: boolean;
  data: SupplyWithUsage[];
}


interface PaginatedSuppliesResponse {
  success: boolean;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  data: SupplyWithUsage[];
}

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Supply'],
  endpoints: (builder) => ({
    // 1) List unpopulated supplies
    listSupplies: builder.query<Supply[], void>({
      query: () => '/supplies',
      transformResponse: (response: SupplyListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((supply) => ({ type: 'Supply' as const, id: supply._id })),
              { type: 'Supply', id: 'LIST' },
            ]
          : [{ type: 'Supply', id: 'LIST' }],
    }),

    // Paginated usage logs
    listSuppliesUsagePaginated: builder.query<PaginatedSuppliesResponse, {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
    }>({
      query: ({ page = 1, limit = 10, search = '', sortBy = 'name' }) => ({
        url: `/supplies/usage-logs?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((supply) => ({ type: 'Supply' as const, id: supply._id })),
              { type: 'Supply', id: 'LIST' },
            ]
          : [{ type: 'Supply', id: 'LIST' }],
    }),

    // 2) Get single supply (unpopulated)
    getSupplyById: builder.query<Supply, string>({
      query: (supplyId) => `/supplies/${supplyId}`,
      transformResponse: (response: SupplyResponse) => response.data,
      providesTags: (result, error, arg) => [{ type: 'Supply', id: arg }],
    }),

    // 3) Create supply
    createSupply: builder.mutation<Supply, Partial<Supply>>({
      query: (body) => ({
        url: '/supplies',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Supply', id: 'LIST' }],
    }),

    // 4) Add stock
    addStock: builder.mutation<Supply, { supplyId: string; quantity: number }>({
      query: ({ supplyId, quantity }) => ({
        url: `/supplies/${supplyId}/add-stock`,
        method: 'POST',
        body: { quantity },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Supply', id: arg.supplyId },
        { type: 'Supply', id: 'LIST' },
      ],
    }),

    // 5) Update supply
    updateSupply: builder.mutation<Supply, { supplyId: string; data: Partial<Supply> }>({
      query: ({ supplyId, data }) => ({
        url: `/supplies/${supplyId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Supply', id: arg.supplyId }],
    }),

    // 6) Delete supply
    deleteSupply: builder.mutation<{ success: boolean }, string>({
      query: (supplyId) => ({
        url: `/supplies/${supplyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Supply', id: arg },
        { type: 'Supply', id: 'LIST' },
      ],
    }),

    // 7) Record usage
    recordUsage: builder.mutation<Supply, RecordUsageParams>({
      query: ({ supplyId, ...body }) => ({
        url: `/supplies/${supplyId}/usage`,
        method: 'POST',
        body, // Need to pass body here
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Supply', id: arg.supplyId },
        { type: 'Supply', id: 'THRESHOLD' },
      ],
    }),

    // 8) List supplies with usage logs (populated userId)
    listSuppliesWithUsage: builder.query<SupplyWithUsage[], void>({
      query: () => '/supplies/with-usage',
      transformResponse: (response: SupplyWithUsageResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((supply) => ({ type: 'Supply' as const, id: supply._id })),
              { type: 'Supply', id: 'LIST' },
            ]
          : [{ type: 'Supply', id: 'LIST' }],
    }),

    // 9) Check thresholds
    checkThresholds: builder.query<string[], void>({
      query: () => '/supplies/check-thresholds',
      transformResponse: (response: { success: boolean; messages: string[] }) => response.messages,
      providesTags: [{ type: 'Supply', id: 'THRESHOLD' }],
    }),

 // 10) List supplies by location
    listSuppliesByLocation: builder.query<Supply[], string>({
      query: (location) => `/supplies/location/${location}`,
      transformResponse: (response: SupplyListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((supply) => ({ type: 'Supply' as const, id: supply._id })),
              { type: 'Supply', id: 'LIST' },
            ]
          : [{ type: 'Supply', id: 'LIST' }],
    }),
  }),
});

// Hooks
export const {
  useListSuppliesQuery,
  useGetSupplyByIdQuery,
  useCreateSupplyMutation,
  useUpdateSupplyMutation,
  useDeleteSupplyMutation,
  useRecordUsageMutation,
  useCheckThresholdsQuery,
  useAddStockMutation,
  useListSuppliesWithUsageQuery,
  useListSuppliesUsagePaginatedQuery,
  useListSuppliesByLocationQuery,
} = inventoryApi;
