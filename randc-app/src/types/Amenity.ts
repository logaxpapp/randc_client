// src/types/Amenity.ts

export interface Amenity {
    _id: string;
    name: string;
    description?: string;
    createdBy?: string; // User ID who created the amenity
    createdAt: string; // ISO date string
  }
  