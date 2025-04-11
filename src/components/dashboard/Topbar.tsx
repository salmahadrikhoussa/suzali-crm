import React, { useState } from 'react';

const Topbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Search Bar */}
      <div className="flex-1 max-w-md mr-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search in CRM..." 
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 absolute left-3 top-2.5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative hover:bg-gray-100 p-2 rounded-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            SZ
          </div>
          <span className="text-sm font-medium">Suzali</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;