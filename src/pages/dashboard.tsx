import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChartBarIcon, BuildingOffice2Icon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    companies: 0,
    deals: 0,
    activeDeals: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would fetch these from your API
        // For now, we'll use dummy data
        // const companiesRes = await fetch('/api/companies/stats');
        // const dealsRes = await fetch('/api/deals/stats');
        
        // if (!companiesRes.ok || !dealsRes.ok) throw new Error('Failed to fetch stats');
        
        // const companiesData = await companiesRes.json();
        // const dealsData = await dealsRes.json();

        // Dummy data
        setStats({
          companies: 12,
          deals: 24,
          activeDeals: 15,
          totalValue: 67500,
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
      title: 'Total Deals',
      value: stats.deals,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Deal Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ];

  const recentDeals = [
    { id: 1, title: 'Software Implementation', company: 'Acme Inc', stage: 'proposal', value: 15000 },
    { id: 2, title: 'Consulting Services', company: 'TechCorp', stage: 'negotiation', value: 8500 },
    { id: 3, title: 'Product License', company: 'Globex', stage: 'qualified', value: 12000 },
    { id: 4, title: 'Support Package', company: 'Wayne Enterprises', stage: 'closed-won', value: 5000 },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <h3 className="text-lg font-medium">Recent Deals</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentDeals.map((deal) => (
                        <tr key={deal.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deal.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deal.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{deal.stage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${deal.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Upcoming Tasks</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>No upcoming tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}