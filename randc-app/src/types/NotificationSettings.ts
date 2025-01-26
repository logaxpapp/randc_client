// src/types/NotificationSettings.ts

// For the “staff”, “customer”, “personalized” toggles
export interface ReminderSettings {
    email?: boolean;
    daysBefore?: number;
  }
  
  export interface StaffSettings {
    confirmation?: boolean;
    changes?: boolean;
    cancellation?: boolean;
    reminder?: ReminderSettings;
  }
  
  export interface CustomerSettings {
    confirmation?: boolean;
    changes?: boolean;
    cancellation?: boolean;
  }
  
  export interface Personalized {
    senderName?: string;
    emailSignature?: string;
  }
  
  // The main shape returned by the backend
  export interface NotificationSettings {
    _id?: string;       // assigned by Mongo
    user: string;       // user _id
    tenant: string;     // tenant _id
    staff?: StaffSettings;
    customer?: CustomerSettings;
    personalized?: Personalized;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
  }
  