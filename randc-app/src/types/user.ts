// C:\Users\kriss\randc-app\src\types\user.ts

export type UserRole = 'SEEKER' | 'STAFF' | 'CLEANER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  _id: string;                 // Unique user ID
  firstName?: string;          // Optional first name
  lastName?: string;           // Optional last name
  email: string;               // User email (required)
  phoneNumber?: string;        // Optional phone number
  address?: string;            // Optional address
  profileImage?: string;       // Optional URL to the user's profile image
  roles: UserRole[];           // Array of user roles (e.g., 'STAFF', 'ADMIN')
  tenant?: string;             // Associated tenant ID (optional)
  isActive: boolean;           // Indicates if the user is active
  status: string;              // Custom user status (e.g., 'Active', 'Suspended')
  createdAt: Date;             // Account creation timestamp
  isEmailVerified: boolean;    // Whether the user's email is verified
  mfaEnabled?: boolean;        // Optional: Is multi-factor authentication enabled
  password: string;             // User's password (encrypted)
}


export interface CreateUserFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }
  

