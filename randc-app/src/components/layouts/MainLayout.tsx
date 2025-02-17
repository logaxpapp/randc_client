// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../pages/home/components/Header';
import FooterSection from '../../pages/home/components/FooterSection';
import TenantLocationPrompt from '../TenantLocationPrompt';
import { useAppSelector } from '../../app/hooks';

function MainLayout() {
  // Suppose you have a Redux store or context with `user` info
  // e.g. const { user } = useAppSelector(state => state.auth);
  // If user is a "tenant" or has a `tenantId`, we pass it to TenantLocationPrompt

  const user = useAppSelector((state) => state.auth.user);  
  console.log(user);

  const tenantId = user?.tenant; // single-tenant approach

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 relative">
        <Outlet />

       
      </div>
      <FooterSection />
    </div>
  );
}

export default MainLayout;
