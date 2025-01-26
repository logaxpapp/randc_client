import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

/**
 * Currently covers:
 *   GET /audits   -> listAudits
 *
 * If you add more routes (like GET /audits/:id, or POST logs), you can add them here.
 */
export const auditApi = createApi({
  reducerPath: 'auditApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // GET /audits (admin only)
    listAudits: builder.query<any[], void>({
      query: () => '/audits',
    }),
  }),
});

// Export the hook
export const {
  useListAuditsQuery,
} = auditApi;
