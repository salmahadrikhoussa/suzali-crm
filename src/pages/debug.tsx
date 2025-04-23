import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from '../components/layout/MainLayout';

export default function DebugPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check database connection
  const checkDbConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug/connection');
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to connect to database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Get profile data
  const getProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to get profile data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Update profile with test data
  const updateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate a timestamp to ensure changes are detectable
      const timestamp = new Date().toISOString().split('T')[0];
      
      const testData = {
        firstName: `Test ${timestamp}`,
        lastName: `User ${timestamp}`,
        email: session?.user?.email || 'test@example.com',
        jobTitle: `Engineer ${timestamp}`,
        phone: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
        timezone: 'UTC',
        language: 'en'
      };
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Profile updated successfully: ${JSON.stringify(result, null, 2)}`);
        // Refresh profile data
        getProfileData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    if (session) {
      checkDbConnection();
      getProfileData();
    }
  }, [session]);

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>
        
        {error && (
          <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Connection Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
            
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={checkDbConnection}
                disabled={loading}
              >
                Check Connection
              </button>
            </div>
            
            {dbStatus && (
              <div className="border rounded p-4 bg-gray-50">
                <p className="font-medium">Status: <span className={dbStatus.database.status === 'Connected' ? 'text-green-600' : 'text-red-600'}>{dbStatus.database.status}</span></p>
                
                {dbStatus.database.status === 'Connected' && (
                  <>
                    <p>Database: {dbStatus.database.database}</p>
                    <p>Collections: {dbStatus.database.collections.join(', ')}</p>
                  </>
                )}
                
                {dbStatus.database.connectionError && (
                  <p className="text-red-600">Error: {dbStatus.database.connectionError}</p>
                )}
                
                <div className="mt-4">
                  <p className="font-medium">Environment:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {Object.entries(dbStatus.environment).map(([key, value]) => (
                      <li key={key}>{key}: {value as string}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium">Session:</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(dbStatus.session, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={getProfileData}
                disabled={loading}
              >
                Get Profile
              </button>
              
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={updateProfile}
                disabled={loading}
              >
                Test Update Profile
              </button>
            </div>
            
            {userProfile && (
              <div className="border rounded p-4 bg-gray-50">
                <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(userProfile, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
        
        {/* System Information */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Session Info</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
            </div>
            
            <div>
              <h3 className="font-medium">Environment</h3>
              <p className="text-sm">Node.js Environment: <b>{process.env.NODE_ENV}</b></p>
              <p className="text-sm">Next Auth URL: <b>{process.env.NEXTAUTH_URL || 'Not set'}</b></p>
              <p className="text-sm">MongoDB URI: <b>{process.env.MONGODB_URI ? 'Set' : 'Not set'}</b></p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}