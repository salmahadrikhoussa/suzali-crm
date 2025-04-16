import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  BuildingOffice2Icon, 
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Sample company data
const SAMPLE_COMPANIES = [
  { id: 1, name: 'Acme Corporation', industry: 'Technology', employees: 150, revenue: '$12M', status: 'Active' },
  { id: 2, name: 'Globex Industries', industry: 'Manufacturing', employees: 430, revenue: '$45M', status: 'Active' },
  { id: 3, name: 'Wayne Enterprises', industry: 'Defense', employees: 3000, revenue: '$1B', status: 'Active' },
  { id: 4, name: 'Stark Industries', industry: 'Technology', employees: 1200, revenue: '$250M', status: 'Inactive' },
  { id: 5, name: 'Umbrella Corporation', industry: 'Pharmaceuticals', employees: 850, revenue: '$120M', status: 'Active' },
];

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter companies based on search term
  const filteredCompanies = SAMPLE_COMPANIES.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg">
          {/* Header Section */}
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold">Companies</h1>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Company
            </button>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Companies List */}
          <div className="p-6">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <BuildingOffice2Icon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No companies found matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
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
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{company.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.employees}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            company.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href={`/companies/${company.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </a>
                          <a href={`/companies/${company.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
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