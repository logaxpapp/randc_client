// C:\Users\kriss\randc-app\src\types\Booking.ts

export interface ServiceObject {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface TimeSlotObject {
  _id: string;
  startTime: string;
  endTime: string;
}

export interface SeekerObject {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface SpecialRequests {
  hasPets?: boolean;
  numberOfRooms?: number;
  note?: string;
  address?: string;
  roomType?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CustomerObject {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Booking {
  _id: string;
  shortCode?: string;
  tenant: string;
  title?: string;
  startTime: string;
  endTime: string;

  service?: ServiceObject;   // object, not string
  timeSlot?: TimeSlotObject; // object, not string
  seeker?: SeekerObject;     // object, not string
  staff?: string;
  nonUserEmail?: string;
  status: BookingStatus;
  notes?: string;
  specialRequests?: SpecialRequests;
  customer: CustomerObject; // object, not string
  price?: number;

  createdAt?: string;
  updatedAt?: string;
}
