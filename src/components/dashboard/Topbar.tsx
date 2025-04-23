import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  BellIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useProfile } from '../../contexts/ProfileContext';

export default function Topbar() {
  const { data: session } = useSession();
  const { profileImage } = useProfile();
  const router = useRouter();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get current page title based on route
  const getPageTitle = () => {
    const path = router.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/companies')) return 'Companies';
    if (path.includes('/contacts')) return 'Contacts';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/files')) return 'File Manager';
    if (path.includes('/prospects')) return 'Prospects';
    return 'Suzali CRM';
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden text-gray-500 hover:text-gray-700 mr-4">
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">{getPageTitle()}</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-grow max-w-md ml-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Quick Add Button */}
          <div className="relative">
            <button 
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
            
            {showQuickActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <Link href="/companies/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Company
                </Link>
                <Link href="/contacts/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Contact
                </Link>
                <Link href="/tasks/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Task
                </Link>
              </div>
            )}
          </div>
          
          {/* Calendar */}
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none" title="Calendar">
            <CalendarIcon className="h-6 w-6" />
          </button>
          
          {/* Help */}
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none" title="Help">
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </div>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border">
                <div className="px-4 py-2 border-b">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-2 hover:bg-gray-50 border-b">
                    <p className="text-sm font-medium">New contact added</p>
                    <p className="text-xs text-gray-500">John Smith from TechCorp</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-50 border-b">
                    <p className="text-sm font-medium">Task reminder</p>
                    <p className="text-xs text-gray-500">Follow up with Globex</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-50">
                    <p className="text-sm font-medium">New contact added</p>
                    <p className="text-xs text-gray-500">John Smith from TechCorp</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t">
                  <Link href="/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative">
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white relative overflow-hidden">
                {profileImage ? (
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <span>{session?.user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </Link>
                <Link href="/settings?tab=notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Notification Settings
                </Link>
                <Link href="/auth/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}