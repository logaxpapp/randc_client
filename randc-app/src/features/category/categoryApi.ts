// src/features/category/categoryApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { Category } from '../../types/Category';
import { customBaseQuery } from '../api/baseQuery';

export interface CategoryPayload {
  _id: string;
  name: string;
  description?: string;
  
  // If you want nested subcategories:
  children?: CategoryPayload[];

  // Other fields like parentCategory, tags, etc.
  // parentCategory?: string;
  // tags?: string[];
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body, // { name, description, parentCategory, tags, etc. }
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    listCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: { success: boolean; data: Category[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),


    /**
     * 3) Search Categories
     *    If you ever want a separate endpoint for advanced searching:
     */
    searchCategories: builder.query<Category[], { keyword?: string; parent?: string; topLevelOnly?: boolean }>({
      query: (params) => {
        const queryString = new URLSearchParams();
        if (params.keyword) queryString.append('keyword', params.keyword);
        if (params.parent) queryString.append('parent', params.parent);
        if (params.topLevelOnly) queryString.append('topLevelOnly', 'true');

        return `/categories/search?${queryString.toString()}`;
      },
      transformResponse: (response: { success: boolean; data: Category[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Category' as const, id: _id }))]
          : [],
    }),

    /**
     * 4) Get Category by ID
     */
    getCategoryById: builder.query<Category, string>({
      query: (categoryId) => `/categories/${categoryId}`,
      transformResponse: (response: { success: boolean; data: Category }) =>
        response.data,
      providesTags: (result, error, categoryId) => [{ type: 'Category', id: categoryId }],
    }),

    /**
     * 5) Update Category
     */
    updateCategory: builder.mutation<Category, { categoryId: string; data: Partial<Category> }>({
      query: ({ categoryId, data }) => ({
        url: `/categories/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    /**
     * 6) Delete Category
     */
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useListCategoriesQuery,
  useSearchCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
