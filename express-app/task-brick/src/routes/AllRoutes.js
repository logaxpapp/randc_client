import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import RegisterPage from '../components/RegisterPage';
import LoginPage from '../components/auth/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer'; // Make sure to create this component
import SignupPage from '../common/SignupPage'; // Make sure to create this component
import ForgotPassword from '../components/auth/ForgotPassword'; // Make sure to create this component
import ResetPassword from '../components/auth/ResetPassword'; // Make sure to create this component
import Dashboard from '../components/dashboard/Dashboard'; 
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
import Career from '../components/global/Career';
import ApplyNowPage from '../components/global/ApplyNowPage';
import OurServices from '../components/global/OurServices';
import OurSolutions from '../components/global/OurSolutions';
import AboutUs from '../components/global/About';
import HowItWorks from '../components/global/HowItWorks';

const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
   
  </>
);

const AllRoutes = () => {
  return (

   

    <Router>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/registers" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/template-one" element={<MainLayout><TemplateDetailsComponent /></MainLayout>} />
        <Route path="/gant-chart" element={<MainLayout><GanttChart /></MainLayout>} />
        <Route path="/whiteboard" element={<MainLayout><Whiteboard /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterComponent /></MainLayout>} />
        <Route path="/career" element={<MainLayout><Career /></MainLayout>} />
        <Route path="/apply/:jobId" element={<ApplyNowPage />} />
        <Route path="/services" element={<MainLayout><OurServices /></MainLayout>} />
        <Route path="/solution" element={<MainLayout><OurSolutions /></MainLayout>} />
        <Route path="/about_us" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/how_it_works" element={<MainLayout><HowItWorks /></MainLayout>} />


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