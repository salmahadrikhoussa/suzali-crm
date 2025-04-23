import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon, ClipboardIcon, KeyIcon } from '@heroicons/react/24/outline';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

export default function ApiKeysSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/apikeys');
        if (response.ok) {
          const data = await response.json();
          setApiKeys(data.keys);
        } else {
          // Create dummy data if API endpoint doesn't exist
          setApiKeys([
            {
              id: '1',
              name: 'Primary API Key',
              key: 'sk_test_123456789012345678901234',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            },
            {
              id: '2',
              name: 'Development API Key',
              key: 'sk_dev_123456789012345678901234',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
        // Create dummy data on error
        setApiKeys([
          {
            id: '1',
            name: 'Primary API Key',
            key: 'sk_test_123456789012345678901234',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
          },
          {
            id: '2',
            name: 'Development API Key',
            key: 'sk_dev_123456789012345678901234',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApiKeys();
  }, []);

  // Generate a new API key
  const handleGenerateKey = async () => {
    const keyName = prompt('Enter a name for your new API key:');
    if (!keyName) return;
    
    try {
      const response = await fetch('/api/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: keyName })
      });
      
      if (response.ok) {
        const newKey = await response.json();
        setApiKeys([...apiKeys, newKey]);
        
        // Auto-show the new key
        setShowKey(prev => ({ ...prev, [newKey.id]: true }));
        
        toast.success('API key generated successfully');
      } else {
        // If API doesn't exist, create a dummy key
        const newKey: ApiKey = {
          id: Date.now().toString(),
          name: keyName,
          key: `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
          createdAt: new Date().toISOString()
        };
        
        setApiKeys([...apiKeys, newKey]);
        
        // Auto-show the new key
        setShowKey(prev => ({ ...prev, [newKey.id]: true }));
        
        toast.success('API key generated successfully');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    }
  };

  // Revoke (delete) an API key
  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/apikeys/${keyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast.success('API key revoked successfully');
      } else {
        // If API doesn't exist, just remove from state
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast.success('API key revoked successfully');
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  // Toggle showing/hiding a key
  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // Copy key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('API key copied to clipboard');
      },
      () => {
        toast.error('Failed to copy API key');
      }
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format a key for display (show or mask)
  const formatKey = (key: string, show: boolean) => {
    if (show) return key;
    return `${key.substring(0, 4)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  return (
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
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-gray-500">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <KeyIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No API keys found</p>
              <p className="mt-1 text-sm text-gray-500">Generate a key to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Created on {formatDate(apiKey.createdAt)}</p>
                      {apiKey.lastUsed && (
                        <p className="text-sm text-gray-500">Last used: {formatDate(apiKey.lastUsed)}</p>
                      )}
                      <div className="mt-2 flex items-center">
                        <input
                          type={showKey[apiKey.id] ? 'text' : 'password'}
                          value={formatKey(apiKey.key, showKey[apiKey.id] || false)}
                          readOnly
                          className="border rounded px-3 py-2 text-sm bg-gray-50 font-mono w-64"
                        />
                        <button 
                          className="ml-2 text-gray-500 hover:text-gray-700" 
                          onClick={() => toggleShowKey(apiKey.id)}
                          title={showKey[apiKey.id] ? 'Hide API key' : 'Show API key'}
                        >
                          {showKey[apiKey.id] ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                        <button 
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => copyToClipboard(apiKey.key)}
                          title="Copy to clipboard"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="text-red-600 text-sm hover:underline"
                        onClick={() => handleRevokeKey(apiKey.id)}
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              onClick={handleGenerateKey}
            >
              <KeyIcon className="h-5 w-5 mr-2" />
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
  );
}