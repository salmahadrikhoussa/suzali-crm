import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import MainLayout from '../components/layout/MainLayout';
import { useProfile } from '../contexts/ProfileContext';
import { 
  Cog6ToothIcon, 
  UserCircleIcon,
  BuildingOffice2Icon,
  BellIcon,
  ShieldCheckIcon,
  UsersIcon,
  KeyIcon,
  UserPlusIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Tab interface
interface Tab {
  id: string;
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const { profileImage, updateProfileImage } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
  
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
  
    setIsUploading(true);
  
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      // Use the context function instead of setProfileImage
      updateProfileImage(imageUrl);
      setIsUploading(false);
    };
  
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
  
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
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
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  
                  <div className="mb-8 flex items-start">
                    <div className="mr-6">
                      <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl relative overflow-hidden">
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                      <div className="mt-3">
                        <button 
                          type="button" 
                          onClick={triggerFileInput}
                          disabled={isUploading}
                          className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                        >
                          {isUploading ? (
                            <span>Uploading...</span>
                          ) : (
                            <span>Change Photo</span>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              defaultValue={session?.user?.name?.split(' ')[0] || ''}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              defaultValue={session?.user?.name?.split(' ')[1] || ''}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={session?.user?.email || ''}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <select
                            id="timezone"
                            name="timezone"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="CST">CST (Central Standard Time)</option>
                            <option value="MST">MST (Mountain Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="CET">CET (Central European Time)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            id="language"
                            name="language"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="fr">French</option>
                            <option value="es">Spanish</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        
                        <div className="pt-4">
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'company' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Company Profile</h2>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        defaultValue="Suzali CRM"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                          Industry
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Technology</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                          <option>Education</option>
                          <option>Manufacturing</option>
                          <option>Retail</option>
                          <option>Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Size
                        </label>
                        <select
                          id="size"
                          name="size"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>1-10 employees</option>
                          <option>11-50 employees</option>
                          <option>51-200 employees</option>
                          <option>201-500 employees</option>
                          <option>501-1000 employees</option>
                          <option>1000+ employees</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Company Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-deals" className="text-sm text-gray-700">
                            Deal updates and reminders
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-deals" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-contacts" className="text-sm text-gray-700">
                            Contact activity notifications
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-contacts" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-tasks" className="text-sm text-gray-700">
                            Task reminders
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-tasks" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-team" className="text-sm text-gray-700">
                            Team mentions and comments
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-team" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">System Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-system" className="text-sm text-gray-700">
                            System updates and maintenance
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-system" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="notify-security" className="text-sm text-gray-700">
                            Security alerts
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="notify-security" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notification Frequency</h3>
                      <div className="space-y-2">
                        <div>
                          <label className="inline-flex items-center">
                            <input type="radio" name="frequency" className="h-4 w-4 text-blue-600" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700">Real-time</span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex items-center">
                            <input type="radio" name="frequency" className="h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700">Daily digest</span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex items-center">
                            <input type="radio" name="frequency" className="h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-700">Weekly summary</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Notification Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            name="current-password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            name="new-password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters long and include a number and a special character.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Enhance your account security</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Enable two-factor authentication to add an extra layer of security to your account.
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Session Management</h3>
                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          You're currently signed in on these devices. You can sign out from any sessions that you don't recognize.
                        </p>
                        
                        <ul className="space-y-3">
                          <li className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Current Session</p>
                                <p className="text-xs text-gray-500">
                                  {typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Browser'} • IP: 192.168.1.1
                                </p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Active Now
                              </span>
                            </div>
                          </li>
                          <li className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Chrome on Windows</p>
                                <p className="text-xs text-gray-500">
                                  Last active: April 12, 2025 • IP: 192.168.1.2
                                </p>
                              </div>
                              <button className="text-red-600 text-sm hover:underline">
                                Sign out
                              </button>
                            </div>
                          </li>
                        </ul>
                        
                        <div className="mt-4">
                          <button className="text-red-600 text-sm font-medium hover:underline">
                            Sign out from all other sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">Users & Teams</h2>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      <UserPlusIcon className="h-5 w-5 mr-2" />
                      Invite User
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">User Management</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {session?.user?.name?.charAt(0) || 'U'}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{session?.user?.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">Admin</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                  Edit
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                  Manage Permissions
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    S
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">sarah.j@example.com</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">Sales Manager</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                  Edit
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                  Manage Permissions
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Teams</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Sales Team</h4>
                          <p className="text-sm text-gray-500 mt-1">4 members</p>
                          <div className="flex justify-end mt-2">
                            <button className="text-blue-600 text-sm hover:underline">
                              Manage
                            </button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Marketing Team</h4>
                          <p className="text-sm text-gray-500 mt-1">3 members</p>
                          <div className="flex justify-end mt-2">
                            <button className="text-blue-600 text-sm hover:underline">
                              Manage
                            </button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Support Team</h4>
                          <p className="text-sm text-gray-500 mt-1">2 members</p>
                          <div className="flex justify-end mt-2">
                            <button className="text-blue-600 text-sm hover:underline">
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          + Create New Team
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'api' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">API Keys</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                      <p className="text-yellow-800 text-sm">
                        <strong>Important:</strong> API keys provide complete access to your CRM data. Treat them like passwords and never share them publicly.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Your API Keys</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">Primary API Key</h4>
                              <p className="text-sm text-gray-500 mt-1">Created on April 10, 2025</p>
                              <div className="mt-2 flex items-center">
                                <input
                                  type="password"
                                  value="••••••••••••••••••••••••••••••"
                                  readOnly
                                  className="border rounded px-3 py-2 text-sm bg-gray-50"
                                />
                                <button className="ml-2 text-blue-600 text-sm hover:underline">
                                  Show
                                </button>
                                <button className="ml-2 text-blue-600 text-sm hover:underline">
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div>
                              <button className="text-red-600 text-sm hover:underline">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">Development API Key</h4>
                              <p className="text-sm text-gray-500 mt-1">Created on April 15, 2025</p>
                              <div className="mt-2 flex items-center">
                                <input
                                  type="password"
                                  value="••••••••••••••••••••••••••••••"
                                  readOnly
                                  className="border rounded px-3 py-2 text-sm bg-gray-50"
                                />
                                <button className="ml-2 text-blue-600 text-sm hover:underline">
                                  Show
                                </button>
                                <button className="ml-2 text-blue-600 text-sm hover:underline">
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div>
                              <button className="text-red-600 text-sm hover:underline">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Generate New API Key
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">API Documentation</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Learn how to use our API to integrate with your applications and automate your workflows.
                      </p>
                      <a 
                        href="#"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View API Documentation
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'email' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Email Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Integration</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="email-provider" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Provider
                          </label>
                          <select
                            id="email-provider"
                            name="email-provider"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option>Gmail</option>
                            <option>Microsoft Outlook</option>
                            <option>Custom SMTP</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Sync emails with contacts automatically
                            </span>
                          </label>
                        </div>
                        
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Track email opens and clicks
                            </span>
                          </label>
                        </div>
                        
                        <div className="pt-4">
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Connect Email Account
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Templates</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Welcome Email</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Sent to new contacts automatically
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 text-sm hover:underline">
                                Edit
                              </button>
                              <button className="text-gray-600 text-sm hover:underline">
                                Preview
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Follow Up</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                For following up on deals
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 text-sm hover:underline">
                                Edit
                              </button>
                              <button className="text-gray-600 text-sm hover:underline">
                                Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          + Create New Template
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Signature</h3>
                      <div className="border rounded-lg p-4">
                        <div className="text-sm">
                          <p><strong>{session?.user?.name}</strong></p>
                          <p>Suzali CRM</p>
                          <p>{session?.user?.email}</p>
                        </div>
                        <div className="mt-4">
                          <button className="text-blue-600 text-sm hover:underline">
                            Edit Signature
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}