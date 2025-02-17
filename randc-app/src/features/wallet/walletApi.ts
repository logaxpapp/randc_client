// src/features/wallet/walletApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// Types
export interface IWallet {
  _id: string;
  ownerType: 'TENANT' | 'USER';
  ownerRef: 'Tenant' | 'User';
  owner: string;           // The ObjectId as a string
  balance: number;
  currency: string;
  createdAt: string;       // or Date
}

export interface IWalletTransaction {
  _id: string;
  wallet: string;          // wallet._id
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description?: string;
  createdAt: string;
}

interface WalletArg {
  ownerType: 'TENANT' | 'USER';
  ownerId: string;
}

// Extended transaction argument with filters/pagination
interface TransactionsArg extends WalletArg {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionsResponse {
  data: IWalletTransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Wallet', 'WalletTx'],
  endpoints: (builder) => ({

    /*************************************************************
     * GET /api/wallet/:ownerType/:ownerId -> getWallet
     *************************************************************/
    getWallet: builder.query<IWallet, WalletArg>({
      query: ({ ownerType, ownerId }) => `/wallet/${ownerType}/${ownerId}`,
      transformResponse: (resp: { success: boolean; data: IWallet }) => resp.data,
      providesTags: (result) =>
        result ? [{ type: 'Wallet', id: result._id }] : [],
    }),

    /*************************************************************
     * GET /api/wallet/:ownerType/:ownerId/transactions -> getWalletTransactions
     *************************************************************/
    getWalletTransactions: builder.query<TransactionsResponse, TransactionsArg>({
      query: ({ ownerType, ownerId, page = 1, limit = 10, search = '', sortField = 'createdAt', sortOrder = 'desc' }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search,
          sortField,
          sortOrder,
        });
        return `/wallet/${ownerType}/${ownerId}/transactions?${params.toString()}`;
      },
      transformResponse: (resp: { success: boolean; data: IWalletTransaction[]; meta: any }) => {
        // Return data + meta
        return { data: resp.data, meta: resp.meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((tx) => ({ type: 'WalletTx' as const, id: tx._id })),
              { type: 'WalletTx', id: 'LIST' },
            ]
          : [{ type: 'WalletTx', id: 'LIST' }],
    }),

    /*************************************************************
     * POST /api/wallet/:ownerType/:ownerId/deposit -> deposit
     *************************************************************/
    deposit: builder.mutation<
      { success: boolean; message: string; data?: { balance: number } },
      { ownerType: 'TENANT' | 'USER'; ownerId: string; amount: number; description?: string }
    >({
      query: ({ ownerType, ownerId, amount, description }) => ({
        url: `/wallet/${ownerType}/${ownerId}/deposit`,
        method: 'POST',
        body: { amount, description },
      }),
      invalidatesTags: ['Wallet', 'WalletTx'],
    }),

    /*************************************************************
     * POST /api/wallet/:ownerType/:ownerId/withdraw -> withdraw
     *************************************************************/
    withdraw: builder.mutation<
      { success: boolean; message: string; data?: { balance: number } },
      { ownerType: 'TENANT' | 'USER'; ownerId: string; amount: number; description?: string }
    >({
      query: ({ ownerType, ownerId, amount, description }) => ({
        url: `/wallet/${ownerType}/${ownerId}/withdraw`,
        method: 'POST',
        body: { amount, description },
      }),
      invalidatesTags: ['Wallet', 'WalletTx'],
    }),

    /*************************************************************
     * POST /api/wallet/stripe/deposit -> create Stripe deposit session
     *************************************************************/
    createStripeDepositSession: builder.mutation<
      { success: boolean; url?: string },
      { ownerType: 'TENANT' | 'USER'; ownerId: string; amount: number }
    >({
      query: ({ ownerType, ownerId, amount }) => ({
        url: `/wallet/stripe/deposit`,
        method: 'POST',
        body: { ownerType, ownerId, amount },
      }),
      // If user completes deposit, the webhook eventually updates wallet
      // We can optionally force a refetch if you want:
      invalidatesTags: ['Wallet', 'WalletTx'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useCreateStripeDepositSessionMutation,  // <-- new
} = walletApi;
