import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './component/global/HomePage';
import LoginPage from './component/global/LoginPage';
import Registration from './component/global/Registration';
import Dashboard from './component/global/Dashboard';
import Calendar from './component/global/Calendar';
import VideoConferencing from './component/global/VideoConferencing';
import Header from './component/global/Header';
import Footer from './component/global/Footer';
import PageNotFound from './component/global/PageNotFound';
import CreateUser from './component/users/CreateUser';
import UserList from './component/users/UserList';
import TenantList from './component/tenants/TenantList';
import OurTeam from './component/global/OurTeam';
import AppointmentForm from './component/appointments/AppointmentForm';
import AppointmentList from './component/appointments/AppointmentList';


const AllRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/our-team" element={<OurTeam />} />


        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Calendar />} /> {/* Default view in the dashboard */}
          <Route path="video-conferencing" element={<VideoConferencing />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="users" element={<UserList />} />
          <Route path="tenants" element={<TenantList />} />
          <Route path="create-appointment" element={<AppointmentForm />} />
          <Route path="appointments" element={<AppointmentList />} />

          {/* Add more sub-routes here */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AllRoutes;
