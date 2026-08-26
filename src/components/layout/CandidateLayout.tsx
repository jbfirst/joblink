import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CandidateSidebar } from './CandidateSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export const CandidateLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />
      <div className="flex-1 flex pt-16 pb-20 md:pb-0">
        <CandidateSidebar />
        <main className="flex-1 w-full max-w-container-max mx-auto p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};
