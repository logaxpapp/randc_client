// src/types/JobCard.ts
import type { Booking } from './Booking'; 

export interface JobStep {
    name: string;
    status: 'PENDING' | 'DONE';
    startedAt?: string;    // ISO date
    finishedAt?: string;   // ISO date
    orderIndex?: number;
  }
  
  export interface JobCard {
    _id: string;
    tenant: string;                  // or an object if you populate
    booking: Booking;                // or a Booking object if you populate
    assignedStaff?: {
        _id: string;
        employeeId?: string;
    };          // or a Staff object if you populate
    status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    steps: JobStep[];
    startedAt?: string;              // ISO
    finishedAt?: string;             // ISO
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    deadline: string;               // ISO
  }
  
  export interface JobCardResponse {
    success: boolean;
    data: JobCard;
  }
  
  export interface JobCardListResponse {
    success: boolean;
    data: JobCard[];
  }
  