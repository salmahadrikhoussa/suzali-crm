import React, { ReactNode } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;