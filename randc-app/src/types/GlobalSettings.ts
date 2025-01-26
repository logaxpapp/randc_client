// src/types/GlobalSettings.ts
export interface GlobalSettings {
    _id?: string;                  // MongoDB _id if needed
    slotGenMinDays: number;        // Site-wide default minimum days
    slotGenMaxDays: number;        // Site-wide default maximum days
    allowTenantRegistration: boolean; // Whether new tenants can self-register
    maxUsersPerTenant: number;     // Maximum users allowed per tenant
    userPasswordMinLength: number; // Global user password minimum length
    reviewAutoPublishThreshold: number; // Number of days to auto-publish reviews
  }
  