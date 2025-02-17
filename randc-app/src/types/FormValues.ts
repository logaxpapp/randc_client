// src/types/FormValues.ts

export interface AddressFormValues {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  export interface TenantBioFormValues {
    aboutUs: string;
    domain?: string;
    companyPhoneNumber?: string;
    email?: string;
    website?: string;
    address: AddressFormValues;
    bannerImages: string[];
  }
  