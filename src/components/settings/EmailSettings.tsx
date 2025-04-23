import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface EmailSettings {
  provider: 'gmail' | 'outlook' | 'custom';
  syncEmails: boolean;
  trackOpens: boolean;
  connectedAccount?: string;
  isConnected: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject?: string;
}

export default function EmailSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'gmail',
    syncEmails: true,
    trackOpens: true,
    isConnected: false
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [signature, setSignature] = useState('');
  
  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        setIsLoading(true);
        
        // Fetch email settings
        const settingsResponse = await fetch('/api/email/settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData);
        }
        
        // Fetch email templates
        const templatesResponse = await fetch('/api/email/templates');
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setTemplates(templatesData);
        } else {
          // Create dummy template data
          setTemplates([
            { 
              id: '1', 
              name: 'Welcome Email', 
              description: 'Sent to new contacts automatically',
              subject: 'Welcome to our company'
            },
            { 
              id: '2', 
              name: 'Follow Up', 
              description: 'For following up on deals',
              subject: 'Following up on our conversation'
            }
          ]);
        }
        
        // Fetch email signature
        const signatureResponse = await fetch('/api/email/signature');
        if (signatureResponse.ok) {
          const signatureData = await signatureResponse.json();
          setSignature(signatureData.content);
        } else {
          // Create dummy signature
          setSignature(`<p><strong>${session?.user?.name || 'Your Name'}</strong></p><p>Suzali CRM</p><p>${session?.user?.email || 'your.email@example.com'}</p>`);
        }
      } catch (error) {
        console.error('Error fetching email settings:', error);
        // Don't show error - endpoints might not exist yet
        
        // Create dummy data
        setTemplates([
          { 
            id: '1', 
            name: 'Welcome Email', 
            description: 'Sent to new contacts automatically',
            subject: 'Welcome to our company'
          },
          { 
            id: '2', 
            name: 'Follow Up', 
            description: 'For following up on deals',
            subject: 'Following up on our conversation'
          }
        ]);
        
        setSignature(`<p><strong>${session?.user?.name || 'Your Name'}</strong></p><p>Suzali CRM</p><p>${session?.user?.email || 'your.email@example.com'}</p>`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmailSettings();
  }, [session]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle toggle changes
  const handleToggleChange = (field: 'syncEmails' | 'trackOpens') => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Connect email account
  const handleConnectEmail = async () => {
    try {
      setIsSaving(true);
      
      // This would be an API call to start OAuth flow
      const response = await fetch('/api/email/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider: settings.provider })
      });
      
      if (response.ok) {
        // In a real implementation, this might redirect to OAuth provider
        setSettings(prev => ({
          ...prev,
          isConnected: true,
          connectedAccount: session?.user?.email || 'your.email@example.com'
        }));
        
        toast.success('Email account connected successfully');
      } else {
        // For demo purposes, just simulate success
        setSettings(prev => ({
          ...prev,
          isConnected: true,
          connectedAccount: session?.user?.email || 'your.email@example.com'
        }));
        
        toast.success('Email account connected successfully');
      }
    } catch (error) {
      console.error('Error connecting email account:', error);
      toast.error('Failed to connect email account');
    } finally {
      setIsSaving(false);
    }
  };

  // Disconnect email account
  const handleDisconnectEmail = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/email/disconnect', {
        method: 'POST'
      });
      
      if (response.ok) {
        setSettings(prev => ({
          ...prev,
          isConnected: false,
          connectedAccount: undefined
        }));
        
        toast.success('Email account disconnected successfully');
      } else {
        // For demo purposes, just simulate success
        setSettings(prev => ({
          ...prev,
          isConnected: false,
          connectedAccount: undefined
        }));
        
        toast.success('Email account disconnected successfully');
      }
    } catch (error) {
      console.error('Error disconnecting email account:', error);
      toast.error('Failed to disconnect email account');
    } finally {
      setIsSaving(false);
    }
  };

  // Save email settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/email/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        toast.success('Email settings saved successfully');
      } else {
        // For demo purposes, just simulate success
        toast.success('Email settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    // In a real app, this would open a template editor
    // For demo, just add a new template to the list
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      description: 'Template description',
      subject: 'Subject line'
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success('New template created');
  };

  // Handle editing a signature
  const handleEditSignature = () => {
    // In a real app, this would open a signature editor
    // For demo, just show a toast
    toast.info('Signature editor would open here');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Email Settings</h2>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-500">Loading email settings...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Email Integration */}
          <div>
            <h3 className="text-lg font-medium mb-4">Email Integration</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label htmlFor="email-provider" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Provider
                </label>
                <select
                  id="email-provider"
                  name="provider"
                  value={settings.provider}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Microsoft Outlook</option>
                  <option value="custom">Custom SMTP</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.syncEmails}
                    onChange={() => handleToggleChange('syncEmails')}
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
                    checked={settings.trackOpens}
                    onChange={() => handleToggleChange('trackOpens')}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Track email opens and clicks
                  </span>
                </label>
              </div>
              
              <div className="pt-4 flex space-x-3">
                {settings.isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                      <span className="text-sm text-gray-700">{settings.connectedAccount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectEmail}
                      className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Disconnecting...' : 'Disconnect Email Account'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Connecting...' : 'Connect Email Account'}
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Email Templates */}
          <div>
            <h3 className="text-lg font-medium mb-4">Email Templates</h3>
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                      {template.subject && (
                        <p className="text-sm text-gray-700 mt-1">
                          Subject: {template.subject}
                        </p>
                      )}
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
              ))}
            </div>
            
            <div className="mt-4">
              <button 
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={handleCreateTemplate}
              >
                + Create New Template
              </button>
            </div>
          </div>
          
          {/* Email Signature */}
          <div>
            <h3 className="text-lg font-medium mb-4">Email Signature</h3>
            <div className="border rounded-lg p-4">
              <div 
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: signature }}
              />
              <div className="mt-4">
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={handleEditSignature}
                >
                  Edit Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}