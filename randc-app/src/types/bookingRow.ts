// e.g. src/types/bookingRow.ts
export interface BookingRow {
    _id: string;
    shortCode?: string;
    nonUserEmail?: string;
    seeker?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    service?: {
      _id: string;
      name: string;
      price: number;
      duration: number;
    };
    timeSlot?: {
      _id: string;
      startTime: string;
      endTime: string;
    };
    status?: string;
    notes?: string;
   
  }
  