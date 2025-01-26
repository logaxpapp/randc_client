// src/features/api/baseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setLogout, setAuthError } from '../auth/authSlice';

let csrfToken: string | null = null;
export function setCSRFToken(token: string) {
  csrfToken = token;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  credentials: 'include', // crucial for HttpOnly cookies
});

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let modifiedArgs: FetchArgs =
      typeof args === 'string' ? { url: args } : { ...args };

    modifiedArgs.headers = {
      ...((modifiedArgs.headers as Record<string, string>) || {}),
    };

    if (csrfToken) {
      modifiedArgs.headers['X-CSRF-Token'] = csrfToken;
    }

    const result = await rawBaseQuery(modifiedArgs, api, extraOptions);

    // If server returns 401 => setLogout + setAuthError
    if (result.error && result.error.status === 401) {
      api.dispatch(setLogout());
      api.dispatch(setAuthError('Not authenticated'));
    }

    return result;
  };
