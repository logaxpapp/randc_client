// src/features/customer/customerApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * The shape of a single Customer, matching your backend `Customer` model fields.
 */
export interface CustomerPayload {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  isBlacklisted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


// src/features/customer/customerApi.ts

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: customBaseQuery, // or fetchBaseQuery({ baseUrl: '/api' })
    tagTypes: ['Customer'],
  
    endpoints: (builder) => ({
      // 1) CREATE single customer -> POST /customers
      createCustomer: builder.mutation<CustomerPayload, Partial<CustomerPayload>>({
        query: (body) => ({
          url: '/customers',
          method: 'POST',
          body,
        }),
        // If creation succeeds, we'll want to refresh the customer list
        invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
      }),
  
      // 2) BULK IMPORT -> POST /customers/bulk
      // The server returns: { success: boolean; data: CustomerPayload[] }
      // We'll transform so the hook receives just CustomerPayload[].
      bulkImportCustomers: builder.mutation<CustomerPayload[], { customers: Partial<CustomerPayload>[] }>({
        query: ({ customers }) => ({
          url: '/customers/bulk',
          method: 'POST',
          body: { customers },
        }),
        transformResponse: (response: { success: boolean; data: CustomerPayload[] }) => {
          return response.data;
        },
        invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
      }),
  
      // 3) LIST customers -> GET /customers
      // The server returns: { success: boolean; data: CustomerPayload[] }
      // We'll transform so the hook receives just CustomerPayload[].
      listCustomers: builder.query<CustomerPayload[], { blacklisted?: boolean; search?: string } | void>({
        query: (filters) => {
          // Construct query string if filters are provided
          let queryStr = '';
          if (filters) {
            const params = new URLSearchParams();
            if (filters.blacklisted !== undefined) {
              params.set('blacklisted', String(filters.blacklisted));
            }
            if (filters.search) {
              params.set('search', filters.search);
            }
            queryStr = `?${params.toString()}`;
          }
          return `/customers${queryStr}`;
        },
        transformResponse: (response: { success: boolean; data: CustomerPayload[] }) => {
          return response.data;
        },
        providesTags: (result) =>
          result
            ? [
                ...result.map((cust) => ({ type: 'Customer' as const, id: cust._id })),
                { type: 'Customer', id: 'LIST' },
              ]
            : [{ type: 'Customer', id: 'LIST' }],
      }),
  
      // 4) GET single customer by ID -> GET /customers/:customerId
      // The server returns: { success: boolean; data: CustomerPayload }
      getCustomerById: builder.query<CustomerPayload, string>({
        query: (customerId) => `/customers/${customerId}`,
        // Transform to return only the customer doc
        transformResponse: (response: { success: boolean; data: CustomerPayload }) => response.data,
        providesTags: (result, error, arg) =>
          result ? [{ type: 'Customer', id: result._id }] : [],
      }),
  
      // 5) UPDATE customer -> PUT /customers/:customerId
      updateCustomer: builder.mutation<
        CustomerPayload,
        { customerId: string; body: Partial<CustomerPayload> }
      >({
        query: ({ customerId, body }) => ({
          url: `/customers/${customerId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Customer', id: arg.customerId },
          { type: 'Customer', id: 'LIST' },
        ],
      }),
  
      // 6) DELETE customer -> DELETE /customers/:customerId
      deleteCustomer: builder.mutation<void, string>({
        query: (customerId) => ({
          url: `/customers/${customerId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, customerId) => [
          { type: 'Customer', id: customerId },
          { type: 'Customer', id: 'LIST' },
        ],
      }),
  
      // 7) BLACKLIST customer -> PATCH /customers/:customerId/blacklist
      // The server returns: { success: boolean; data: CustomerPayload }
      blacklistCustomer: builder.mutation<CustomerPayload, string>({
        query: (customerId) => ({
          url: `/customers/${customerId}/blacklist`,
          method: 'PATCH',
        }),
        transformResponse: (response: { success: boolean; data: CustomerPayload }) => response.data,
        invalidatesTags: (result, error, customerId) => [
          { type: 'Customer', id: customerId },
          { type: 'Customer', id: 'LIST' },
        ],
      }),
    }),
  });
  
  export const {
    useCreateCustomerMutation,
    useBulkImportCustomersMutation,
    useListCustomersQuery,
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useBlacklistCustomerMutation,
  } = customerApi;
  