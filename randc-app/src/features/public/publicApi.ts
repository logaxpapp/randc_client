// src/features/public/publicApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TimeSlotPayload } from '../timeSlot/timeSlotApi';
import { Booking, SpecialRequests, BookingResponse } from '../../types/Booking';

// The server responds with { success: boolean; data: T }
interface PublicListResponse<T> {
  success: boolean;
  data: T;
  // You might also have totalResults, totalPages, etc.
  totalResults?: number;
  totalPages?: number;
  currentPage?: number;
}
interface ICategory {
  _id: string;
  name: string;
  // etc.
}

interface IPromo {
  _id: string;
  code: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}

// Example shape of a Service in the marketplace
interface MarketplaceService {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: string;
  onSale: boolean;
  promos: {
    discountPercentage: number;
    validUntil: string;
  }[];
  // category: string;
  category: ICategory;
  tenant?: {
    _id: string;
    name: string;
   rating: number;
   
  };
}


// For getServiceById shape:
export interface ServicePayload {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive?: boolean;
  createdAt?: string;
  images: string[];
  category?: string;      // main category
  subcategories?: string[];  // array of subcategory IDs
}

// Example shape for a single tenant’s detail response
interface MarketplaceTenantData {
  tenant: {
    _id: string;
    name: string;
    description?: string;
    images?: string[];
    bannerImages?: string[]; 
    rating?: number;
    locationEnabled?: boolean;
    location?: {
      type?: string;
      coordinates?: [number, number]; // [lng, lat]
    };
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    companyPhoneNumber?: string;
    domain?: string;
    aboutUs?: string;
    amenities?: {
      _id: string;
      name: string;
    }[];
    
    settings?: {
      workDays?: {
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
        breaks: { start: string; end: string }[];
      }[];
      // ...subscribe info
      subscriptionPlan?: string;
      subscriptionStatus?: string;
      // etc.
    };
    // anything else your page uses
  };
  services: MarketplaceService[];
  galleries: any[];   // or a typed array if you have a known shape
  timeSlots: any[];   // similarly typed if you know the shape
  reviews?: any[];
  promos?: IPromo[];
}

interface IAmenity {
  _id: string;
  name: string;
  // etc.
}

interface ICategory {
  _id: string;
  name: string;
  // etc.
}

// Create the RTK Query API slice
export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  }),
  endpoints: (builder) => ({

    // 1) List Categories
    listCategories: builder.query<any[], { name?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return { url: `/public/categories?${searchParams}`, method: 'GET' };
      },
      transformResponse: (response: PublicListResponse<any[]>) => response.data,
    }),

    // 2) List Services
    listServices: builder.query<any[], { name?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return { url: `/public/services?${searchParams}`, method: 'GET' };
      },
      transformResponse: (response: PublicListResponse<any[]>) => response.data,
    }),

    // 3) Marketplace services (with pagination, filters, etc.)
    listMarketplaceServices: builder.query<
      {
        data: MarketplaceService[];
        totalResults?: number;
        totalPages?: number;
        currentPage?: number;
      },
      {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        rating?: number;
        amenities?: string;
        onSale?: boolean;
        sort?: 'lowToHigh' | 'highToLow' | 'latest';
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        for (const [key, val] of Object.entries(params)) {
          if (val !== undefined) {
            searchParams.set(key, String(val));
          }
        }
        return { url: `/marketplace?${searchParams}`, method: 'GET' };
      },
      transformResponse: (response: {
        success: boolean;
        data: MarketplaceService[];
        totalResults?: number;
        totalPages?: number;
        currentPage?: number;
      }) => ({
        data: response.data,
        totalResults: response.totalResults,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      }),
    }),

    // 4) Get single service by ID
    getServiceById: builder.query<ServicePayload, string>({
      query: (serviceId) => `/marketplace/services/${serviceId}`,
      transformResponse: (response: { success: boolean; data: ServicePayload }) =>
        response.data,
    }),

    // 5) Retrieve time slots for a given service on a specific date
    getServiceSlotsByDate: builder.query<
      TimeSlotPayload[],
      { serviceId: string; date: string }
    >({
      query: ({ serviceId, date }) => `/marketplace/services/${serviceId}/timeSlots?date=${date}`,
      transformResponse: (resp: { success: boolean; data: TimeSlotPayload[] }) => resp.data,
    }),

    // 6)  // POST /marketplace/bookings => create a new booking
    createBooking: builder.mutation<
      Booking,
      {
        serviceId: string;
        timeSlotId?: string;
        notes?: string;
        nonUserEmail?: string;
        specialRequests?: SpecialRequests;
        promoCode?: string;
        seeker?:string;
      }
    >({
      query: (body) => ({
        url: '/marketplace/bookings',
        method: 'POST',
        body,
      }),
      transformResponse: (resp: BookingResponse) => resp.data,
    }),

    // 7) List categories without any params
    listWithoutParamsCategories: builder.query<ICategory[], void>({
      query: () => ({ url: '/public/categories', method: 'GET' }),
      transformResponse: (response: PublicListResponse<ICategory[]>) => response.data,
    }),

    // 8) List Amenities
    listAmenities: builder.query<IAmenity[], void>({
      query: () => ({ url: 'marketplace/amenities', method: 'GET' }),
      transformResponse: (response: PublicListResponse<IAmenity[]>) => response.data,
    }),

    // 9) Get aggregated tenant data => GET /marketplace/:tenantId
    getTenantMarketplaceData: builder.query<MarketplaceTenantData, string>({
      query: (tenantId) => ({
        url: `/marketplace/${tenantId}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: MarketplaceTenantData }) =>
        response.data,
    }),
  }),
});

// Finally, export all auto-generated hooks
export const {
  useListCategoriesQuery,
  useListServicesQuery,
  useListMarketplaceServicesQuery,
  useGetTenantMarketplaceDataQuery,
  useListWithoutParamsCategoriesQuery,
  useListAmenitiesQuery,
  useGetServiceSlotsByDateQuery,
  useGetServiceByIdQuery,
  // This is the new mutation hook:
  useCreateBookingMutation,
} = publicApi;
