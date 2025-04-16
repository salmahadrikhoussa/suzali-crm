import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  CurrencyDollarIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Sample deals data
const SAMPLE_DEALS = [
  { 
    id: 1, 
    name: 'Enterprise Software License', 
    company: 'Acme Corporation', 
    value: '$120,000', 
    stage: 'Negotiation', 
    probability: 70,
    expectedCloseDate: '2025-06-15',
    owner: 'John Smith'
  },
  { 
    id: 2, 
    name: 'Manufacturing Equipment', 
    company: 'Globex Industries', 
    value: '$450,000', 
    stage: 'Proposal', 
    probability: 50,
    expectedCloseDate: '2025-07-22',
    owner: 'Sarah Johnson'
  },
  { 
    id: 3, 
    name: 'Security System Upgrade', 
    company: 'Wayne Enterprises', 
    value: '$75,000', 
    stage: 'Closed Won', 
    probability: 100,
    expectedCloseDate: '2025-04-10',
    owner: 'Michael Brown'
  },
  { 
    id: 4, 
    name: 'R&D Partnership', 
    company: 'Stark Industries', 
    value: '$250,000', 
    stage: 'Discovery', 
    probability: 25,
    expectedCloseDate: '2025-09-30',
    owner: 'Emily Davis'
  },
  { 
    id: 5, 
    name: 'Medical Supplies Contract', 
    company: 'Umbrella Corporation', 
    value: '$180,000', 
    stage: 'Closed Lost', 
    probability: 0,
    expectedCloseDate: '2025-05-05',
    owner: 'James Wilson'
  },
];

// Deal stages with their corresponding colors
const DEAL_STAGES = {
  'Discovery': { color: 'bg-purple-100 text-purple-800' },
  'Proposal': { color: 'bg-blue-100 text-blue-800' },
  'Negotiation': { color: 'bg-yellow-100 text-yellow-800' },
  'Closed Won': { color: 'bg-green-100 text-green-800' },
  'Closed Lost': { color: 'bg-red-100 text-red-800' }
};

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort deals
  const filteredAndSortedDeals = SAMPLE_DEALS
    .filter(deal => 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Handle string fields
      if (['name', 'company', 'stage', 'owner', 'expectedCloseDate'].includes(sortField)) {
        const valA = a[sortField as keyof typeof a] as string;
        const valB = b[sortField as keyof typeof b] as string;
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      // Handle numeric probability field
      else if (sortField === 'probability') {
        return sortDirection === 'asc' 
          ? a.probability - b.probability
          : b.probability - a.probability;
      }
      // Handle value (need to strip $ and commas)
      else if (sortField === 'value') {
        const valA = parseFloat(a.value.replace(/[$,]/g, ''));
        const valB = parseFloat(b.value.replace(/[$,]/g, ''));
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 inline ml-1" />
      : <ArrowDownIcon className="h-4 w-4 inline ml-1" />;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg">
          {/* Header Section */}
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold">Deals</h1>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Deal
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="p-6 border-b flex flex-wrap md:flex-nowrap gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search deals..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                Filter
              </button>
            </div>
          </div>

          {/* Deals List */}
          <div className="p-6">
            {filteredAndSortedDeals.length === 0 ? (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No deals found matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <span className="flex items-center">
                          Deal Name
                          {renderSortIndicator('name')}
                        </span>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('company')}
                      >
                        <span className="flex items-center">
                          Company
                          {renderSortIndicator('company')}
                        </span>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('value')}
                      >
                        <span className="flex items-center">
                          Value
                          {renderSortIndicator('value')}
                        </span>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('stage')}
                      >
                        <span className="flex items-center">
                          Stage
                          {renderSortIndicator('stage')}
                        </span>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('probability')}
                      >
                        <span className="flex items-center">
                          Probability
                          {renderSortIndicator('probability')}
                        </span>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('expectedCloseDate')}
                      >
                        <span className="flex items-center">
                          Expected Close
                          {renderSortIndicator('expectedCloseDate')}
                        </span>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedDeals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{deal.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deal.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deal.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            DEAL_STAGES[deal.stage as keyof typeof DEAL_STAGES]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {deal.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deal.probability}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(deal.expectedCloseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href={`/deals/${deal.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </a>
                          <a href={`/deals/${deal.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}