import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const DashboardPage: React.FC = () => {
  const metrics = [
    { 
      title: 'Total Companies', 
      value: 42, 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm4 5a.5.5 0 11-1 0 .5.5 0 011 0z',
      color: 'bg-blue-500'
    },
    { 
      title: 'Active Deals', 
      value: 22, 
      icon: 'M13 10V3L4 14h7v7l9-11z',
      color: 'bg-green-500'
    },
    { 
      title: 'Leads', 
      value: 14, 
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      color: 'bg-purple-500'
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.title} 
              className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
            >
              <div className={`${metric.color} text-white p-3 rounded-full`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={metric.icon} 
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">{metric.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-gray-700">New Deal Created</p>
                <p className="text-sm text-gray-500">Client: Acme Corporation</p>
              </div>
              <span className="text-sm text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-gray-700">Lead Converted</p>
                <p className="text-sm text-gray-500">John Doe from Tech Innovations</p>
              </div>
              <span className="text-sm text-gray-400">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">Project Started</p>
                <p className="text-sm text-gray-500">Marketing Campaign for XYZ Ltd</p>
              </div>
              <span className="text-sm text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            <span>Create Lead</span>
          </button>
          <button className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
              />
            </svg>
            <span>New Deal</span>
          </button>
          <button className="bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition flex items-center justify-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
              />
            </svg>
            <span>Create Project</span>
          </button>
          <button className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;