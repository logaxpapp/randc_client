// src/features/favorite/favoriteApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

// Suppose we have an interface for "Favorite"
export interface Favorite {
  _id: string;
  user: string;    // user ID
  service: {       // or string if you only have the ID
    _id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    images: string[];
  };
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

// The response shape from the server
interface FavoriteListResponse {
  success: boolean;
  data: Favorite[];
}

interface FavoriteResponse {
  success: boolean;
  data: Favorite;
}

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Favorite'],
  endpoints: (builder) => ({
    // 1) List favorites
    listFavorites: builder.query<Favorite[], void>({
      query: () => '/favorites',
      transformResponse: (response: FavoriteListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((fav) => ({ type: 'Favorite' as const, id: fav._id })),
              { type: 'Favorite', id: 'LIST' },
            ]
          : [{ type: 'Favorite', id: 'LIST' }],
    }),

    // 2) Create a favorite
    createFavorite: builder.mutation<
      Favorite,
      { serviceId: string; note?: string }
    >({
      query: (body) => ({
        url: '/favorites',
        method: 'POST',
        body,
      }),
      transformResponse: (response: FavoriteResponse) => response.data,
      invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
    }),

    // 3) Delete a favorite
    deleteFavorite: builder.mutation<{ success: boolean; message: string }, string>({
      query: (favoriteId) => ({
        url: `/favorites/${favoriteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Favorite', id: arg }, { type: 'Favorite', id: 'LIST' }],
    }),

    // 4) Update a favorite
    updateFavorite: builder.mutation<
      Favorite,
      { favoriteId: string; note: string }
    >({
      query: ({ favoriteId, note }) => ({
        url: `/favorites/${favoriteId}`,
        method: 'PUT',
        body: { note },
      }),
      transformResponse: (response: FavoriteResponse) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Favorite', id: arg.favoriteId },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListFavoritesQuery,
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useUpdateFavoriteMutation,
} = favoriteApi;
