// src/router/AppRouter.tsx (excerpt)

import  { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import Loader from '../components/common/Loader';
import HomePage from '../pages/home/HomePage';
import CompanySignUp from '../pages/registration/CompanySignUp'; 
import UserSignUp from '../pages/registration/UserSignUp';  
import LoginPage from '../pages/auth/LoginPage';          
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';   
import MainLayout from '../components/layouts/MainLayout';
import PublicReviewPage from '../pages/reviews/PublicReviewPage';
const CategoryManager = lazy(() => import('../pages/category/CategoryManager'));
const PublicMarketplace = lazy(() => import('../pages/marketplace/PublicMarketplace'));
const BusinessDetailPage = lazy(() => import('../pages/marketplace/BusinessDetailPage'));



// Dashboards
import AdminDashboard from '../pages/admin/AdminDashboard';
import CleanerDashboard from '../pages/cleaner/CleanerDashboard';
import UserDashboard from '../pages/user/UserDashboard'; 

// lazy imports for admin sub-pages
const AdminNotifications = lazy(() => import('../pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/auth/Settings'));
const TenantCalendarPage = lazy(() => import('../pages/tenant/TenantCalendarPage'));
const ServiceListPage = lazy(() => import('../pages/service/ServiceListPage'));
const CustomerListPage = lazy(() => import('../pages/customer/CustomerListPage'));

// TENANT PAGES
const StaffListPage = lazy(() => import('../pages/staff/StaffListPage'));
const TimeSlotListPage = lazy(() => import('../pages/timeSlot/TimeSlotListPage'));
const GalleryListPage = lazy(() => import('../pages/gallery/GalleryListPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const TenantBioPage = lazy(() => import('../pages/tenant/TenantBioPage'));
const TenantSubscriptionDashboard = lazy(() => import('../pages/subscriptions/TenantSubscriptionDashboard'));
const InventoryManager = lazy(() => import('../pages/inventory/InventoryManager'));
const BookingManager = lazy(() => import('../pages/booking/BookingManager'));
const TenantReviewManager = lazy(() => import('../pages/reviews/TenantReviewManager'));

// lazy imports for tenant Admin
const AdminUserListPage = lazy(() => import('../pages/admin/AdminUserListPage'));
const TenantManagement = lazy(() => import('../pages/admin/TenantManagement'));
const TenantManagerDashboard = lazy(() => import('../pages/admin/TenantManagerDashboard'));
const SubscriptionPlanManager = lazy(() => import('../pages/subscriptions/SubscriptionPlanManager'));
const AdminTenantSubscriptions = lazy(() => import('../pages/subscriptions/AdminTenantSubscriptions'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ReorderLevelManager = lazy(() => import('../pages/inventory/ReorderLevelManager'));
const SupplyDetailPage = lazy(() => import('../pages/inventory/SupplyDetailPage'));
const SafetyManager = lazy(() => import('../pages/safety/SafetyManager'));
const AmenityManager = lazy(() => import('../pages/amenity/AmenityManager'));

const  NotificationManager = lazy(() => import('../pages/notifications/NotificationManager'));

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* PUBLIC ROUTES using MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/company-signup" element={<CompanySignUp />} />
              <Route path="/user-signup" element={<UserSignUp />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/marketplace" element={<PublicMarketplace />} />
              <Route path="/marketplace/:businessId" element={<BusinessDetailPage />} />
              <Route path="/reviews/public" element={<PublicReviewPage />} />
            </Route>

            {/* Dashboard routes (not using MainLayout example) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} >
            <Route
                path="profile"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
            <Route
                path="user-management"
                element={
                  <Suspense fallback={<Loader />}>
                    <UserManagement />
                  </Suspense>
                }
              />
              <Route
                path="notifications"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminNotifications />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<Loader />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
               <Route
                path="chat"
                element={
                  <Suspense fallback={<Loader />}>
                    <ChatPage />
                  </Suspense>
                }
              />
              <Route
                path="admin-user-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminUserListPage />
                  </Suspense>
                }
              />
              <Route
                path="tenant-management"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantManagement />
                  </Suspense>
                }
              />
             

              <Route path="admin-calender"
              element={
                <Suspense fallback={<Loader />}>
                  <TenantCalendarPage />
                </Suspense>
              }
              />
              <Route
                path="category-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <CategoryManager />
                  </Suspense>
                }
              />
              <Route
                path="tenant-manager-dashboard"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantManagerDashboard />
                  </Suspense>
                }
              />
              <Route
                path="admin-tenant-subscriptions"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminTenantSubscriptions />
                  </Suspense>
                }
              />
              <Route
                path="subscription-plan-manager"
                element={
                  <Suspense fallback={<Loader />}>
                    <SubscriptionPlanManager />
                  </Suspense>
                }
              />
              <Route
                path="safety-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <SafetyManager />
                  </Suspense>
                }
              />
              <Route
                path="amenity-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <AmenityManager />
                  </Suspense>
                }
              />
              <Route
                path="admin-notifications"
                element={
                  <Suspense fallback={<Loader />}>
                    <NotificationManager />
                  </Suspense>
                }
              />
            </Route>

            <Route path="/cleaner/dashboard" element={<CleanerDashboard />} >
            <Route
                path="profile"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
               <Route
                path="settings"
                element={
                  <Suspense fallback={<Loader />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route
                path="tenant-calendar"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantCalendarPage />
                  </Suspense>
                }
              />
              <Route
                path="staff-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <StaffListPage />
                  </Suspense>
                }
              />
              <Route
                path="time-slot-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <TimeSlotListPage />
                  </Suspense>
                }
              />
              <Route
                path="gallery-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <GalleryListPage />
                  </Suspense>
                }
              />
              <Route
              path="service-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <ServiceListPage />
                  </Suspense>
                }
              />
              <Route
                path="chat"
                element={
                  <Suspense fallback={<Loader />}>
                    <ChatPage />
                  </Suspense>
                }
              />
              <Route
                path="customer-list"
                element={
                  <Suspense fallback={<Loader />}>
                    <CustomerListPage />
                  </Suspense>
                }
                  />
                  <Route path="tenant-bookings"
                  element={
                    <Suspense fallback={<Loader />}>
                      <BookingManager />
                    </Suspense>
                  }
                  />
                   <Route
                path="tenant-bio"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantBioPage />
                  </Suspense>
                }
              />
              <Route
                path="tenant-subscription-dashboard"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantSubscriptionDashboard />
                  </Suspense>
                }
              />
              <Route
                path="cleaner-notifications"
                element={
                  <Suspense fallback={<Loader />}>
                    <NotificationManager />
                  </Suspense>
                }
              />
              <Route
                path="inventory-manager"
                element={
                  <Suspense fallback={<Loader />}>
                    <InventoryManager />
                  </Suspense>
                }
              />
              <Route
                path="reorder-level-manager"
                element={
                  <Suspense fallback={<Loader />}>
                    <ReorderLevelManager />
                  </Suspense>
                }
              />
              <Route
                path="supplies/:supplyId"
                element={
                  <Suspense fallback={<Loader />}>
                    <SupplyDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="user-reviews"
                element={
                  <Suspense fallback={<Loader />}>
                    <TenantReviewManager />
                  </Suspense>
                }
              />
            </Route>

            
            
          
            <Route path="/user/dashboard" element={<UserDashboard />}>
            <Route
                path="profile"
                element={
                  <Suspense fallback={<Loader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
               <Route
                path="settings"
                element={
                  <Suspense fallback={<Loader />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
               <Route
                path="chat"
                element={
                  <Suspense fallback={<Loader />}>
                    <ChatPage />
                  </Suspense>
                }
              />
              <Route
                path="user-notifications"
                element={
                  <Suspense fallback={<Loader />}>
                    <NotificationManager />
                  </Suspense>
                }
              />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
