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
 
import ComingSoon from '../assets/images/coming-soon.png';

// We store the *component* reference, so `icon: IconType;`
export interface NavItem {
  to: string;
  label: string;
  icon: IconType;
  subItems?: NavItem[];
}

export const getNavItems = (role: 'admin' | 'cleaner' | 'user'): NavItem[] => {
  switch (role) {
    case 'admin':
      return [
        { to: '/admin/dashboard/admin-calender', label: 'Dashboard', icon: FaChartPie,  },
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
              to: '/admin/dashboard/user-management/create',
              label: 'Create User',
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
              to: '/admin/subscription/about-us',
              label: 'About Us',
              icon: FaAngleDoubleRight,
            },
            {
              to: '/admin/subscription/contact-us',
              label: 'Contact Us',
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
          to: '/admin/messages',
          label: 'Messages',
          icon: FaClipboardList,
        },
        {
          to: '/admin/help-faq',
          label: 'Help & FAQ',
          icon: FaLifeRing,
        },
        {
          to: '/admin/about-us',
          label: 'About Us',
          icon: FaAngleDoubleRight,
        },
      ];
    case 'cleaner':
      return [
        { to: '/cleaner/dashboard/tenant-calendar', label: 'Overview', icon: FaHome },
        { to: '/cleaner/dashboard/tenant-bio', label: 'Tenancy', icon: FaLifeRing },
        { to: '/cleaner/dashboard/time-slot-list', label: 'Time Slot', icon: FaClipboardList },
        { to: '/cleaner/dashboard/staff-list', label: 'Staff', icon: FaUserCog },
        { to: '/cleaner/dashboard/gallery-list', label: 'Gallery', icon: FaToolbox },
        { to: '/cleaner/dashboard/chat', label: 'Messages', icon: FaEnvelope },
        { to: '/cleaner/dashboard/cleaner-notifications', label: 'Notification', icon: FaAngleDoubleRight },
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
              to: '/cleaner/dashboard/tenant-transaction',
              label: 'Transaction',
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
    case 'user':
    default:
      return [
        { to: '/user/home', label: 'Home', icon: FaHome },
        { to: '/user/bookings', label: 'My Bookings', icon: FaClipboardList },
        { to: '/user/account', label: 'Account', icon: FaUserCog },
        { to: '/user/messages', label: 'Messages', icon: FaEnvelope },
        { to: '/user/help-faq', label: 'Book Mark', icon: FaLifeRing },
        { to: '/user/dashboard/user-notifications', label: 'Notification', icon: FaAngleDoubleRight },
      ];
  }
};
