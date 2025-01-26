// src/features/customer/customer.types.ts
export interface CustomerFormValues {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isBlacklisted?: boolean; // or "boolean"
  }
  