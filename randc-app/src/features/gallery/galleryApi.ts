// src/features/gallery/galleryApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface GalleryPayload {
  _id?: string;
  tenant?: string;
  service?: string;
  name?: string;
  description?: string;
  images?: string[];
  createdAt?: string;
}

export interface ListGalleriesResponse {
  success: boolean;
  data: GalleryPayload[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Gallery'],

  endpoints: (builder) => ({
    listGalleries: builder.query<ListGalleriesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/galleries?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((gal) => ({ type: 'Gallery' as const, id: gal._id ?? 'NO_ID' })),
              { type: 'Gallery', id: 'LIST' },
            ]
          : [{ type: 'Gallery', id: 'LIST' }],
    }),

    createGallery: builder.mutation<any, { service?: string; images?: string[]; name?: string; description?: string }>({
      query: ({ service, images, name, description }) => ({
        url: '/galleries',
        method: 'POST',
        body: { service, images, name, description },
      }),
      invalidatesTags: [{ type: 'Gallery', id: 'LIST' }],
    }),

    updateGallery: builder.mutation<
      any,
      { galleryId: string; service?: string; images?: string[]; name?: string; description?: string }
    >({
      query: ({ galleryId, ...body }) => ({
        url: `/galleries/${galleryId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Gallery', id: arg.galleryId },
        { type: 'Gallery', id: 'LIST' },
      ],
    }),

    getGalleryById: builder.query<GalleryPayload, string>({
      query: (galleryId) => `/galleries/${galleryId}`,
      transformResponse: (response: { success: boolean; data: GalleryPayload }) => response.data,
      providesTags: (result) => (result ? [{ type: 'Gallery', id: result._id ?? 'NO_ID' }] : []),
    }),

    deleteGallery: builder.mutation<any, string>({
      query: (galleryId) => ({
        url: `/galleries/${galleryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, galleryId) => [
        { type: 'Gallery', id: galleryId },
        { type: 'Gallery', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListGalleriesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useGetGalleryByIdQuery,
  useDeleteGalleryMutation,
} = galleryApi;
