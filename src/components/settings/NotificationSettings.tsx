import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface NotificationSettings {
  emailNotifications: {
    dealUpdates: boolean;
    contactActivity: boolean;
    taskReminders: boolean;
    teamMentions: boolean;
  };
  systemNotifications: {
    systemUpdates: boolean;
    securityAlerts: boolean;
  };
  notificationFrequency: 'realtime' | 'daily' | 'weekly';
}

export default function NotificationSettings() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification form state
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      dealUpdates: true,
      contactActivity: true,
      taskReminders: true,
      teamMentions: true
    },
    systemNotifications: {
      systemUpdates: true,
      securityAlerts: true
    },
    notificationFrequency: 'realtime'
  });

  // Load initial notification settings
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setIsSaving(true);
        const response = await fetch('/api/user/notifications');
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        // Don't show error - endpoint might not exist yet
      } finally {
        setIsSaving(false);
      }
    };
    
    fetchNotificationSettings();
  }, []);

  // Handle email notification toggle
  const handleEmailToggle = (field: keyof typeof settings.emailNotifications) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [field]: !prev.emailNotifications[field]
      }
    }));
  };

  // Handle system notification toggle
  const handleSystemToggle = (field: keyof typeof settings.systemNotifications) => {
    setSettings(prev => ({
      ...prev,
      systemNotifications: {
        ...prev.systemNotifications,
        [field]: !prev.systemNotifications[field]
      }
    }));
  };

  // Handle frequency change
  const handleFrequencyChange = (frequency: NotificationSettings['notificationFrequency']) => {
    setSettings(prev => ({
      ...prev,
      notificationFrequency: frequency
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // This endpoint would need to be implemented
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notification settings');
      }
      
      // Success notification
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="notify-deals" className="text-sm text-gray-700">
                  Deal updates and reminders
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-deals" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications.dealUpdates}
                    onChange={() => handleEmailToggle('dealUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="notify-contacts" className="text-sm text-gray-700">
                  Contact activity notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-contacts" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications.contactActivity}
                    onChange={() => handleEmailToggle('contactActivity')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="notify-tasks" className="text-sm text-gray-700">
                  Task reminders
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-tasks" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications.taskReminders}
                    onChange={() => handleEmailToggle('taskReminders')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="notify-team" className="text-sm text-gray-700">
                  Team mentions and comments
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-team" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications.teamMentions}
                    onChange={() => handleEmailToggle('teamMentions')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* System Notifications */}
          <div>
            <h3 className="text-lg font-medium mb-3">System Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="notify-system" className="text-sm text-gray-700">
                  System updates and maintenance
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-system" 
                    className="sr-only peer" 
                    checked={settings.systemNotifications.systemUpdates}
                    onChange={() => handleSystemToggle('systemUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="notify-security" className="text-sm text-gray-700">
                  Security alerts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="notify-security" 
                    className="sr-only peer" 
                    checked={settings.systemNotifications.securityAlerts}
                    onChange={() => handleSystemToggle('securityAlerts')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Notification Frequency */}
          <div>
            <h3 className="text-lg font-medium mb-3">Notification Frequency</h3>
            <div className="space-y-2">
              <div>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="h-4 w-4 text-blue-600"
                    checked={settings.notificationFrequency === 'realtime'}
                    onChange={() => handleFrequencyChange('realtime')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Real-time</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="h-4 w-4 text-blue-600"
                    checked={settings.notificationFrequency === 'daily'}
                    onChange={() => handleFrequencyChange('daily')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Daily digest</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="frequency" 
                    className="h-4 w-4 text-blue-600"
                    checked={settings.notificationFrequency === 'weekly'}
                    onChange={() => handleFrequencyChange('weekly')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Weekly summary</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}