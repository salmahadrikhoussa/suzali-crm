import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChartBarIcon, BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    companies: 0,
    contacts: 0,
    tasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would fetch these from your API
        // For now, we'll use dummy data
        // const companiesRes = await fetch('/api/companies/stats');
        // const contactsRes = await fetch('/api/contacts/stats');
        
        // Dummy data
        setStats({
          companies: 12,
          contacts: 24,
          tasks: 15,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Companies',
      value: stats.companies,
      icon: BuildingOffice2Icon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: UserGroupIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Active Tasks',
      value: stats.tasks,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  const recentTasks = [
    { id: 1, title: 'Follow-up call', company: 'Acme Inc', dueDate: '2025-04-28', status: 'pending' },
    { id: 2, title: 'Prepare proposal', company: 'TechCorp', dueDate: '2025-04-30', status: 'in-progress' },
    { id: 3, title: 'Client meeting', company: 'Globex', dueDate: '2025-05-02', status: 'pending' },
    { id: 4, title: 'Update contact info', company: 'Wayne Enterprises', dueDate: '2025-05-05', status: 'completed' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}!</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`${card.color} rounded-lg p-3 text-white mr-4`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                      <p className="text-2xl font-semibold">{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Recent Activities</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Added new contact</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Contact</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 min ago</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Updated company info</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Acme Corp</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Company</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Uploaded document</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TechCorp Proposal</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">File</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Upcoming Tasks</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {task.status === 'in-progress' ? 'In Progress' : 
                                task.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}