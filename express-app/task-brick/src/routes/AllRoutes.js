import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import RegisterPage from '../components/RegisterPage';
import LoginPage from '../components/auth/LoginPage';
import Profile from '../components/Profile';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from '../components/PrivateRoute'; 
import Header from '../components/global/Header';
import Footer from '../components/global/Footer'; // Make sure to create this component
import SignupPage from '../common/SignupPage'; // Make sure to create this component
import ForgotPassword from '../components/auth/ForgotPassword'; // Make sure to create this component
import ResetPassword from '../components/auth/ResetPassword'; // Make sure to create this component
import Dashboard from '../components/dashboard/Dashboard'; 
import RecentProject from '../components/projects/RecentProject';
import TemplateDetailsComponent from '../components/Home/TemplateDetailsComponent';
import ScrollToTop from '../components/utils/ScrollToTop'; 
import GanttChart from '../components/boards/GanttChart '; // Make sure to create this component
import Whiteboard from '../components/boards/Whiteboard'; // Make sure to create this component
import RegisterComponent from '../common/RegisterComponent';

import AdminDashboardLayout from '../BookMiz/AdminDashboardLayout';
import AdminDashboard from '../BookMiz/AdminDashboard';

import Company from '../BookMiz/Company';
import Country from '../BookMiz/Country';
import Users from '../BookMiz/Users';
import AdminUser from '../BookMiz/AdminUser';
import Subscription from '../BookMiz/Subscription';
import Messages from '../BookMiz/Messages';
import Settings from '../BookMiz/Settings';



const AllRoutes = () => {
  return (

    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registers" element={<RegisterPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/template-one" element={<TemplateDetailsComponent />} />
        <Route path="/gant-chart" element={<GanttChart />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/register" element={<RegisterComponent />} />

        <Route path="/book-admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="companies" element={<Company />} />
          <Route path="countries" element={<Country />} />
          <Route path="users" element={<Users />} />
          <Route path="admin-users" element={<AdminUser />} />
          <Route path="subscriptions" element={<Subscription />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>


        {/* //Dashboard Nested routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default AllRoutes;