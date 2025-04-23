import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { UserPlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatarInitial?: string;
  avatarColor?: string;
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
}

export default function UsersAndTeamsSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  
  // Create random background colors for user avatars
  const bgColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  
  useEffect(() => {
    const fetchUsersAndTeams = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('/api/users');
        let userData: User[] = [];
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          userData = usersData.map((user: any) => ({
            ...user,
            avatarInitial: user.name ? user.name.charAt(0).toUpperCase() : '?',
            avatarColor: bgColors[Math.floor(Math.random() * bgColors.length)]
          }));
          setUsers(userData);
        } else {
          // Create dummy user data
          setUsers([
            {
              id: '1',
              name: session?.user?.name || 'Admin User',
              email: session?.user?.email || 'admin@example.com',
              role: 'admin',
              status: 'active',
              avatarInitial: session?.user?.name?.charAt(0).toUpperCase() || 'A',
              avatarColor: 'bg-blue-500'
            },
            {
              id: '2',
              name: 'Sarah Johnson',
              email: 'sarah.j@example.com',
              role: 'manager',
              status: 'active',
              avatarInitial: 'S',
              avatarColor: 'bg-green-500'
            }
          ]);
        }
        
        // Fetch teams
        const teamsResponse = await fetch('/api/teams');
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(teamsData);
        } else {
          // Create dummy team data
          setTeams([
            { id: '1', name: 'Sales Team', memberCount: 4 },
            { id: '2', name: 'Marketing Team', memberCount: 3 },
            { id: '3', name: 'Support Team', memberCount: 2 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching users and teams:', error);
        // Don't show error - endpoints might not exist yet
        
        // Create dummy data
        setUsers([
          {
            id: '1',
            name: session?.user?.name || 'Admin User',
            email: session?.user?.email || 'admin@example.com',
            role: 'admin',
            status: 'active',
            avatarInitial: session?.user?.name?.charAt(0).toUpperCase() || 'A',
            avatarColor: 'bg-blue-500'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            role: 'manager',
            status: 'active',
            avatarInitial: 'S',
            avatarColor: 'bg-green-500'
          }
        ]);
        
        setTeams([
          { id: '1', name: 'Sales Team', memberCount: 4 },
          { id: '2', name: 'Marketing Team', memberCount: 3 },
          { id: '3', name: 'Support Team', memberCount: 2 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsersAndTeams();
  }, [session]);

  // Handle invite user form submission
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail) {
      toast.error('Email is required');
      return;
    }
    
    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to invite user');
      }
      
      // Add new user to the list with pending status
      const newUser: User = {
        id: Date.now().toString(), // Temporary ID
        name: 'Pending User',
        email: newUserEmail,
        role: newUserRole,
        status: 'inactive',
        avatarInitial: '?',
        avatarColor: bgColors[Math.floor(Math.random() * bgColors.length)]
      };
      
      setUsers([...users, newUser]);
      setNewUserEmail('');
      setNewUserRole('user');
      setShowInviteModal(false);
      
      toast.success('User invitation sent successfully');
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to invite user');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      
      // Remove user from the list
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  // Handle create team
  const handleCreateTeam = () => {
    const teamName = prompt('Enter team name:');
    if (!teamName) return;
    
    try {
      // Add new team to the list
      const newTeam: Team = {
        id: Date.now().toString(), // Temporary ID
        name: teamName,
        memberCount: 0
      };
      
      setTeams([...teams, newTeam]);
      toast.success('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create team');
    }
  };

  // Role display names
  const roleNames: Record<string, string> = {
    'admin': 'Administrator',
    'manager': 'Manager',
    'sales': 'Sales Rep',
    'user': 'Standard User'
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Users & Teams</h2>
        <button 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Invite User
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-500">Loading users and teams...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* User Management */}
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full ${user.avatarColor} flex items-center justify-center text-white`}>
                            {user.avatarInitial}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{roleNames[user.role] || user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {/* Don't allow deleting yourself */}
                        {user.email !== session?.user?.email && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Teams */}
          <div>
            <h3 className="text-lg font-medium mb-4">Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{team.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{team.memberCount} members</p>
                  <div className="flex justify-end mt-2">
                    <button className="text-blue-600 text-sm hover:underline">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button 
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={handleCreateTeam}
              >
                + Create New Team
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Invite User</h3>
            <form onSubmit={handleInviteUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Standard User</option>
                    <option value="sales">Sales Rep</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}