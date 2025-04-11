import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      name: 'Sales', 
      href: '/sales', 
      icon: 'M13 10V3L4 14h7v7l9-11z' 
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' 
    },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-blue-600">SUZALI CRM</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className="flex items-center p-2 hover:bg-gray-100 rounded transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={item.icon} 
              />
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;