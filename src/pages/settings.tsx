import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProfileSettings from '../components/settings/ProfileSettings';
import CompanyProfileSettings from '../components/settings/CompanyProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import UsersAndTeamsSettings from '../components/settings/UsersAndTeamsSettings';
import ApiKeysSettings from '../components/settings/ApiKeysSettings';
import EmailSettings from '../components/settings/EmailSettings';

import { 
  UserCircleIcon,
  BuildingOffice2Icon,
  BellIcon,
  ShieldCheckIcon,
  UsersIcon,
  KeyIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Tab interface
interface Tab {
  id: string;
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Settings tabs
  const tabs: Tab[] = [
    { id: 'profile', name: 'My Profile', icon: UserCircleIcon },
    { id: 'company', name: 'Company Profile', icon: BuildingOffice2Icon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'users', name: 'Users & Teams', icon: UsersIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
    { id: 'email', name: 'Email Settings', icon: EnvelopeIcon }
  ];

  // Get content for the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'company':
        return <CompanyProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'users':
        return <UsersAndTeamsSettings />;
      case 'api':
        return <ApiKeysSettings />;
      case 'email':
        return <EmailSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account and CRM preferences</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-gray-200 bg-gray-50">
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <tab.icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {getTabContent()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}