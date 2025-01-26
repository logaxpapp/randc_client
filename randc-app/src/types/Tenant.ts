// src/types/Tenant.ts

export interface WorkDay {
    dayOfWeek: number;         // e.g. 1 = Monday
    openTime: string;          // "08:00"
    closeTime: string;         // "17:00"
    breaks: { start: string; end: string }[];
  }
  
  export interface TenantSettings {
    autoConfirmBookings: boolean;
    allowOverlap: boolean;
    maxOverlaps: number;
    subscriptionStatus?: string;
    subscriptionPlan?: string; // if you store an ID
    subscriptionStart?: string;
    subscriptionEnd?: string;
    lastPayment?: string;
    workDays: WorkDay[];
  }

  export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }

  export interface contactPerson {
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface Tenant {
    _id: string;
    name: string;
    domain?: string;
    aboutUs?: string;
    isActive: boolean;
    isSuspended: boolean;
    createdAt: string;
    settings: TenantSettings;
    images?: string[];
    companyPhoneNumber?: string;
    address?: Address;
    contactPerson?: contactPerson;
    email?: string;
    website?: string;
    //  setSelectedAmenities(tenantData.amenities || []);
    //  setSelectedSafety(tenantData.safetyMeasures || []);
    amenities?: string[];
    safetyMeasures?: string[];
  }
  