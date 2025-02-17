// src/features/tenantVerification/tenantVerificationApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface VerificationDoc {
  docType: string;
  fileUrl: string;
  country: string;
  docNumber?: string;
  expirationDate?: string;
}

export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface TenantVerification {
  _id: string;
  tenant: string; // or { _id: string; name: string } if you populated
  status: VerificationStatus;
  documents: VerificationDoc[];
  thirdPartyResult?: any;
  docNumber?: string;
expirationDate?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * The RTK Query slice for tenant verification
 */
export const tenantVerificationApi = createApi({
  reducerPath: 'tenantVerificationApi',
  baseQuery: customBaseQuery,
  tagTypes: ['TenantVerification'],
  endpoints: (builder) => ({
    // 1) Initiate
    initiateVerification: builder.mutation<
      { success: boolean; verification: TenantVerification },
      { tenantId: string }
    >({
      query: ({ tenantId }) => ({
        url: '/tenant-verification/initiate',
        method: 'POST',
        body: { tenantId },
      }),
      invalidatesTags: ['TenantVerification'],
    }),

    // 2) Upload doc
    uploadVerificationDoc: builder.mutation<
        { success: boolean; verification: TenantVerification },
        {
        verificationId: string;
        docType: string;
        fileUrl: string;
        country: string;
        docNumber?: string;
        expirationDate?: string;
        }
    >({
        query: (body) => ({
        url: `/tenant-verification/${body.verificationId}/upload-doc`,
        method: 'POST',
        body, // includes docNumber, expirationDate, etc.
        }),
        invalidatesTags: ['TenantVerification'],
    }),
  

    // 3) Perform check
    performVerificationCheck: builder.mutation<
      { success: boolean; verification: TenantVerification },
      { verificationId: string }
    >({
      query: ({ verificationId }) => ({
        url: `/tenant-verification/${verificationId}/perform-check`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { verificationId }) => [
        { type: 'TenantVerification', id: verificationId },
      ],
    }),

    // 4) Finalize
    finalizeVerification: builder.mutation<
      { success: boolean; verification: TenantVerification },
      { verificationId: string; status: 'VERIFIED' | 'REJECTED' }
    >({
      query: ({ verificationId, status }) => ({
        url: `/tenant-verification/${verificationId}/finalize`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { verificationId }) => [
        { type: 'TenantVerification', id: verificationId },
      ],
    }),

    // 5) Get by ID
    getVerification: builder.query<
      { success: boolean; verification: TenantVerification },
      string
    >({
      query: (verificationId) => `/tenant-verification/${verificationId}`,
      providesTags: (result) =>
        result
          ? [{ type: 'TenantVerification', id: result.verification._id }]
          : [],
    }),

    // 6) List all
    listAllVerifications: builder.query<
      { success: boolean; verifications: TenantVerification[] },
      void
    >({
      query: () => '/tenant-verification',
      providesTags: (result) =>
        result
          ? [
              ...result.verifications.map((v) => ({
                type: 'TenantVerification' as const,
                id: v._id,
              })),
              'TenantVerification',
            ]
          : ['TenantVerification'],
    }),
    getMyVerification: builder.query<
            { success: boolean; verification: TenantVerification | null },
            void
        >({
            query: () => '/tenant-verification/my',
            providesTags: (result) =>
            result && result.verification
                ? [{ type: 'TenantVerification', id: result.verification._id }]
                : ['TenantVerification'],
        }),

        
    initiateMyVerification: builder.mutation<
            { success: boolean; verification: TenantVerification },
            void
        >({
            query: () => ({
            url: '/tenant-verification/initiate',
            method: 'POST',
            // no body needed if your backend uses tenant from token
            }),
            invalidatesTags: ['TenantVerification'],
        }),

        }),
        });

export const {
  useInitiateVerificationMutation,
  useUploadVerificationDocMutation,
  usePerformVerificationCheckMutation,
  useFinalizeVerificationMutation,
  useGetVerificationQuery,
  useListAllVerificationsQuery,

  useGetMyVerificationQuery,
  useInitiateMyVerificationMutation,
} = tenantVerificationApi;
