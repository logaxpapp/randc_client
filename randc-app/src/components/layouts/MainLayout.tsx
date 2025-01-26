// src/layouts/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import Header from '../../pages/home/components/Header';
import FooterSection from '../../pages/home/components/FooterSection';

function MainLayout() {
  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      {/* HEADER always on top */}
      <Header />

      {/* MAIN CONTENT: The Outlet renders whichever child route is active */}
      <div className="flex-1"> 
        <Outlet />
      </div>

      {/* FOOTER always at the bottom */}
      <FooterSection />
    </div>
  );
}

export default MainLayout;
