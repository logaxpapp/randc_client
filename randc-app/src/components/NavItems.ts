import type { IconType } from 'react-icons';
import {
  FaHome,
  FaUserCog,
  FaUsers,
  FaClipboardList,
  FaToolbox,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaLifeRing,   // Additional icon examples
  FaEnvelope,   // Additional icon examples
  FaChartPie,   // Additional icon examples
} from 'react-icons/fa';
 
import PowerfulEmailEditor from './layouts/PowerfulEmailEditor';

// We store the *component* reference, so `icon: IconType;`
export interface NavItem {
  to: string;
  label: string;
  icon: IconType;
  subItems?: NavItem[];
}

export const getNavItems = (role: 'admin' | 'cleaner' | 'seeker'): NavItem[] => {
  switch (role) {
    case 'admin':
      return [
        { to: 
          '/admin/dashboard',
           label: 'Dashboard',
            icon: FaChartPie, 
          subItems: [
            {
              to: '/admin/dashboard/admin-calender',
              label: 'Admin Calender',
              icon: FaChartPie,
            }, 
          ],
          },
        { to: '/admin/dashboard/admin-notifications', label: 'Notification', icon: FaUsers },
       
        {
          to: '/admin/dashboard/user-management', // Make Manage Users clickable
          label: 'Manage Users',
          icon: FaUsers,
          subItems: [
            {
              to: '/admin/dashboard/user-management',
              label: 'User Management',
              icon: FaUsers,
            },
            {
              to: '/admin/dashboard/wallet-manager',
              label: 'Wallet',
              icon: FaUserCog,
            },
          ],
        },
        {
          to: '/admin/dashboard/tenant-management',
          label: 'Company',
          icon: FaUserCog,
          subItems: [
            {
              to: '/admin/dashboard/tenant-management',
              label: 'Company ',
              icon: FaUserCog,
            },
            {
              to: '/admin/dashboard/category-list',
              label: 'Category Mgt',
              icon: FaUsers,
            },
            {
              to: '/admin/dashboard/tenant-manager-dashboard',
              label: 'Tenant Details',
              icon: FaLifeRing,
            },
            {
              to: '/admin/dashboard/safety-list',
              label: 'Safety Mgt',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/admin/dashboard/amenity-list',
              label: 'Amenity Mgt',
              icon: FaAngleDoubleLeft,
              subItems: [
                { to: '/admin/dashboard/amenity-list', label: 'Amenity List', icon: FaAngleDoubleLeft  },
              ],
              },
          
          ],
        },
        {
          to: '/admin/dashboard/subscription-plan-manager',
          label: 'Subscription',
          icon: FaEnvelope,
          subItems: [
            {
              to: '/admin/dashboard/admin-tenant-subscriptions',
              label: 'Subscribers',
              icon: FaLifeRing,
            },
            {
              to: '/admin/dashboard/subscription-feature-manager',
              label: 'Features',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/admin/dashboard/verification-manager',
              label: 'Verification',
              icon: FaEnvelope,
            },
            {
              to: '/admin/subscription/privacy-policy',
              label: 'Privacy Policy',
              icon: FaAngleDoubleLeft,
            },
          ],
        },
        {
          to: '/admin/dashboard/chat ',
          label: 'Messages',
          icon: FaClipboardList,
        },
        {
          to: '/admin/help-faq',
          label: 'Help & FAQ',
          icon: FaLifeRing,
        },
        {
          to: '/admin/dashboard/recommended-tab',
          label: 'Recommended',
          icon: FaAngleDoubleRight,
        },
      ];
    case 'cleaner':
      return [
        { to: '/cleaner/dashboard', label: 'Dashboard', icon: FaHome },
        { to: '/cleaner/dashboard/tenant-calendar', label: 'Overview', icon: FaHome },
        { to: '/cleaner/dashboard/tenant-bio', label: 'Tenancy', icon: FaLifeRing },
        { to: '/cleaner/dashboard/time-slot-list', label: 'Time Slot', icon: FaClipboardList },
        { 
          to: '/cleaner/dashboard/staff-list',
           label: 'Staff',
            icon: FaUserCog
          , subItems: [
              {
                to: '/cleaner/dashboard/staff-list',
                label: 'Staff List',
                icon: FaUserCog,
              },
              {
                to: '/cleaner/dashboard/staff-availability',
                label: 'Availability',
                icon: FaUserCog,
              },
              {
                to: '/cleaner/dashboard/job-card-manager',
                label: 'JobCard',
                icon: FaUserCog,
              },
              {
                to: '/cleaner/dashboard/my-job-card',
                label: 'MyJobCard',
                icon: FaUserCog,
              },
              {
                to: '/cleaner/dashboard/my-availability',
                label: 'MyAvailability',
                icon: FaUserCog,

              },
            ],
          
          },
        { to: '/cleaner/dashboard/gallery-list', label: 'Gallery', icon: FaToolbox },
        { to: '/cleaner/dashboard/chat', label: 'Messages', icon: FaEnvelope },
        { to: '/cleaner/dashboard/cleaner-notifications', 
          label: 'Notification', 
          icon: FaAngleDoubleRight,
         subItems: [
            {
              to: '/cleaner/dashboard/cleaner-wallet',
              label: 'Wallet',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/cleaner/dashboard/cleaner-recommended',
              label: 'Recommended',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/cleaner/dashboard/cleaner-notifications',
              label: 'Notification',
              icon: FaAngleDoubleRight,
            },
           
          ],
        },
        {
          to: '/cleaner/dashboard/tenant-bookings', // Make Bookings MGT clickable
          label: 'Bookings MGT',
          icon: FaEnvelope,
          subItems: [
            {
              to: '/cleaner/dashboard/service-list',
              label: 'Service List',
              icon: FaLifeRing,
            },
            {
              to: '/cleaner/dashboard/customer-list',
              label: 'Customers',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/cleaner/dashboard/tenant-subscription-dashboard',
              label: 'Subscription',
              icon: FaEnvelope,
            },
            {
              to: '/cleaner/dashboard/inventory-manager',
              label: 'Inventory',
              icon: FaAngleDoubleLeft,
            },
            {
              to: '/cleaner/dashboard/reorder-level-manager',
              label: 'Reorder Level',
              icon: FaChartPie,
            },
            {
              to: '/cleaner/dashboard/verifications',
              label: 'Verfication',
              icon: FaClipboardList,
            },
            {
              to: '/cleaner/dashboard/user-reviews',
              label: 'Reviews',
              icon: FaAngleDoubleRight,
            },
           
          ],
        },
      ];
    case 'seeker':
    default:
      return [
        { to: '/seeker/dashboard/user-marketplace', label: 'Home', icon: FaHome },
        { to: '/seeker/dashboard/user-booking-manager', label: 'My Bookings', icon: FaClipboardList },
        { to: '/seeker/dashboard/chat', label: 'Messages', icon: FaEnvelope },
        { to: '/seeker/dashboard/user-calendar', label: 'Calendar', icon: FaLifeRing },
        { to: '/seeker/dashboard/user-notifications', label: 'Notification', icon: FaAngleDoubleRight },
        { to: '/seeker/dashboard/user-profile', label: 'Profile', icon: FaUserCog },
        { to: '/seeker/dashboard/user-reviews', label: 'Reviews', icon: FaAngleDoubleRight },
        { to: '/seeker/dashboard/user-favorites', label: 'Favorites', icon: FaAngleDoubleRight },
      ];
  }
};
