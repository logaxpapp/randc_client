
// TYPES/STAFF.ts
/**
 * If your backend always returns these fields, 
 * define them as required to match the front-end shape.
 */
export interface StaffPayload {
    _id: string;
    tenant: string;
    userId: string;
    employeeId?: string;
    localRole?: string;
    isActive: boolean;
  
    // The fields we want to display on the front end
    firstName: string; // required
    lastName: string;  // required
    role: string;      // required
  }
  
  /** 
   * Body for creating staff + user 
   */
  export interface CreateStaffWithUserBody {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    localRole?: string; 
    // etc. if your backend needs more fields
  }
  
  export interface UpdateStaffBody {
    localRole?: string;
    isActive?: boolean;
    employeeId?: string;
    // ... (any other staff-only fields)
  }
  
  export interface StaffTransformed {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    // ...
  }

  export interface Staff {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  }
  
  // Suppose your modal/form data is shaped like this:
  export interface StaffFormData {
    _id?: string;
    localRole: string;
    isActive: boolean;
    employeeId?: string;
  }