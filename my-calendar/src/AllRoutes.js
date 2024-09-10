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
import DestinationLink from './component/global/DestinationLink';
import ReserveTicketForm from './component/global/ReserveTicketForm';
import CreateEventsForm from './component/events/CreateEventsForm';
import EventsList from './component/events/EventsList';
import {MicrosoftCalendarIntegration} from './component/Integrations/MicrosoftCalendarIntegration';
import GoogleCalendarIntegration from './component/Integrations/GoogleCalendarIntegration';
import AppleCalendarIntegration from './component/Integrations/AppleCalendarIntegration';
import ZoomIntegration from './component/Integrations/ZoomIntegration';
import GoogleMeetIntegration from './component/Integrations/GoogleMeetIntegration';
import AddEventForm from './component/Integrations/AddEventForm';
import CalendarEventsList from './component/Integrations/EventsList';
import CalendarIntegrationPage from './component/Integrations/CalendarIntegrationPage';
import MsEventList from './component/Integrations/MsEventList';


const AllRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/reserve-tickets" element={<ReserveTicketForm />} />
        <Route path="/destination/:cityId" element={<DestinationLink />} />


        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Calendar />} /> {/* Default view in the dashboard */}
          <Route path="video-conferencing" element={<VideoConferencing />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="users" element={<UserList />} />
          <Route path="tenants" element={<TenantList />} />
          <Route path="create-appointment" element={<AppointmentForm />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="create-events" element={<CreateEventsForm />} />
          <Route path="events" element={<EventsList />} />
          <Route path="microsoft-calendar" element={<MicrosoftCalendarIntegration />} />
          <Route path="google-calendar" element={<GoogleCalendarIntegration />} />
          <Route path="apple-calendar" element={<AppleCalendarIntegration />} />
          <Route path="zoom" element={<ZoomIntegration />} />
          <Route path="google-meet" element={<GoogleMeetIntegration />} />
          <Route path="add-event" element={<AddEventForm />} />
          <Route path="events-list" element={<CalendarEventsList />} />
          <Route path="calendar-integration-page" element={<CalendarIntegrationPage />} />
          <Route path="ms-events" element={<MsEventList />} />

          {/* Add more sub-routes here */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AllRoutes;
