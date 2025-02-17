// src/features/jobCard/jobCardApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';
import {
  JobCard,
  JobCardResponse,
  JobCardListResponse,
} from '../../types/JobCard';

export const jobCardApi = createApi({
  reducerPath: 'jobCardApi',
  baseQuery: customBaseQuery, 
  tagTypes: ['JobCard'],
  endpoints: (builder) => ({
    // 1) LIST job cards => GET /api/jobcards
    listJobCards: builder.query<JobCard[], { staffId?: string; status?: string } | void>({
      query: (params) => {
        let url = '/jobcards';
        if (params && (params.staffId || params.status)) {
          const qs = new URLSearchParams();
          if (params.staffId) qs.append('staffId', params.staffId);
          if (params.status) qs.append('status', params.status);
          url += `?${qs.toString()}`;
        }
        return url;
      },
      transformResponse: (response: JobCardListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((jc) => ({ type: 'JobCard' as const, id: jc._id })),
              { type: 'JobCard', id: 'LIST' },
            ]
          : [{ type: 'JobCard', id: 'LIST' }],
    }),

    // 2) GET single => GET /api/jobcards/:id
    getJobCardById: builder.query<JobCard, string>({
      query: (jobCardId) => `/jobcards/${jobCardId}`,
      transformResponse: (response: JobCardResponse) => response.data,
      providesTags: (result, error, arg) => [{ type: 'JobCard', id: arg }],
    }),

    // 2A - GET by bookingId => GET /api/jobcards/mine

   // in src/features/jobCard/jobCardApi.ts

getJobCardMine: builder.query<JobCard[], {
    status?: string;
    priority?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
  } | void>({
    query: (filters) => {
      let url = '/jobcards/mine';
      if (filters) {
        const qs = new URLSearchParams();
        if (filters.status) qs.append('status', filters.status);
        if (filters.priority) qs.append('priority', filters.priority);
        if (filters.search) qs.append('search', filters.search);
        if (filters.fromDate) qs.append('fromDate', filters.fromDate);
        if (filters.toDate) qs.append('toDate', filters.toDate);
        if ([...qs].length) url += `?${qs.toString()}`;
      }
      return url;
    },
    transformResponse: (resp: JobCardListResponse) => resp.data,
    providesTags: (result) =>
      result
        ? [
            ...result.map((jc) => ({ type: 'JobCard' as const, id: jc._id })),
            { type: 'JobCard', id: 'MINE' },
          ]
        : [{ type: 'JobCard', id: 'MINE' }],
  }),
  
      

    // 3) CREATE => POST /api/jobcards
    createJobCard: builder.mutation<
      JobCard,
      { bookingId: string; notes?: string; deadline?: string; priority?: string }
    >({
      query: (body) => ({
        url: '/jobcards',
        method: 'POST',
        body,
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: [{ type: 'JobCard', id: 'LIST' }],
    }),

    // 4) ASSIGN staff => PUT /api/jobcards/:id/assign-staff
    assignStaff: builder.mutation<
      JobCard,
      { jobCardId: string; staffId: string }
    >({
      query: ({ jobCardId, staffId }) => ({
        url: `/jobcards/${jobCardId}/assign-staff`,
        method: 'PUT',
        body: { staffId },
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
    }),

    // 5) START job => PUT /api/jobcards/:id/start
    startJob: builder.mutation<JobCard, { jobCardId: string }>({
      query: ({ jobCardId }) => ({
        url: `/jobcards/${jobCardId}/start`,
        method: 'PUT',
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
    }),

    // 6) COMPLETE step => PUT /api/jobcards/:id/step
    // pass { jobCardId, stepIndex }
    completeStep: builder.mutation<
      JobCard,
      { jobCardId: string; stepIndex: number }
    >({
      query: ({ jobCardId, stepIndex }) => ({
        url: `/jobcards/${jobCardId}/step`,
        method: 'PUT',
        body: { stepIndex },
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
    }),

    // 7) COMPLETE job => PUT /api/jobcards/:id/complete
    completeJob: builder.mutation<JobCard, { jobCardId: string }>({
      query: ({ jobCardId }) => ({
        url: `/jobcards/${jobCardId}/complete`,
        method: 'PUT',
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
    }),

    // 8) CANCEL job => PUT /api/jobcards/:id/cancel
    cancelJob: builder.mutation<JobCard, { jobCardId: string }>({
      query: ({ jobCardId }) => ({
        url: `/jobcards/${jobCardId}/cancel`,
        method: 'PUT',
      }),
      transformResponse: (response: JobCardResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
    }),
     // NEW: Add a step
     addStep: builder.mutation<
     JobCard,
     { jobCardId: string; stepName: string; orderIndex?: number }
   >({
     query: ({ jobCardId, stepName, orderIndex }) => ({
       url: `/jobcards/${jobCardId}/add-step`,
       method: 'PUT',
       body: { name: stepName, orderIndex },
     }),
     transformResponse: (resp: JobCardResponse) => resp.data,
     invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
   }),

   // NEW: Remove a step
   removeStep: builder.mutation<
     JobCard,
     { jobCardId: string; stepIndex: number }
   >({
     query: ({ jobCardId, stepIndex }) => ({
       url: `/jobcards/${jobCardId}/steps/${stepIndex}`, // or whichever route you choose
       method: 'DELETE',
     }),
     transformResponse: (resp: JobCardResponse) => resp.data,
     invalidatesTags: (result, error, arg) => [
        { type: 'JobCard', id: arg.jobCardId },
        { type: 'JobCard', id: 'LIST' }, // ✅ Ensures the full job card list refreshes
        { type: 'JobCard', id: 'MINE' }, // ✅ Ensures staff's job list updates
      ],
      
   }),
  }),
});

// Hooks auto-generated:
export const {
  useListJobCardsQuery,
  useGetJobCardByIdQuery,
  useCreateJobCardMutation,
  useAssignStaffMutation,
  useStartJobMutation,
  useCompleteStepMutation,
  useCompleteJobMutation,
  useCancelJobMutation,
  useAddStepMutation,
  useRemoveStepMutation,
 useGetJobCardMineQuery,
} = jobCardApi;
