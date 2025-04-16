import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  UserGroupIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

// Sample contacts data
const SAMPLE_CONTACTS = [
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Smith', 
    email: 'john.smith@acme.com', 
    phone: '(555) 123-4567', 
    company: 'Acme Corporation', 
    position: 'CEO',
    status: 'Active',
    lastContactDate: '2025-04-12'
  },
  { 
    id: 2, 
    firstName: 'Sarah', 
    lastName: 'Johnson', 
    email: 'sarah.j@globex.com', 
    phone: '(555) 987-6543', 
    company: 'Globex Industries', 
    position: 'Marketing Director',
    status: 'Active',
    lastContactDate: '2025-04-05'
  },
  { 
    id: 3, 
    firstName: 'Michael', 
    lastName: 'Brown', 
    email: 'michael.brown@wayne.com', 
    phone: '(555) 456-7890', 
    company: 'Wayne Enterprises', 
    position: 'CTO',
    status: 'Inactive',
    lastContactDate: '2025-03-20'
  },
  { 
    id: 4, 
    firstName: 'Emily', 
    lastName: 'Davis', 
    email: 'emily.davis@stark.com', 
    phone: '(555) 234-5678', 
    company: 'Stark Industries', 
    position: 'VP of Sales',
    status: 'Active',
    lastContactDate: '2025-04-10'
  },
  { 
    id: 5, 
    firstName: 'James', 
    lastName: 'Wilson', 
    email: 'james.w@umbrella.com', 
    phone: '(555) 876-5432', 
    company: 'Umbrella Corporation', 
    position: 'Research Lead',
    status: 'Active',
    lastContactDate: '2025-04-14'
  },
];

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  
  // Filter contacts based on search term and active filter
  const filteredContacts = SAMPLE_CONTACTS.filter(contact => {
    const matchesSearch = 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && contact.status.toLowerCase() === activeFilter;
  });

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg">
          {/* Header Section */}
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold">Contacts</h1>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Contact
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-md ${
                    activeFilter === 'all' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${
                    activeFilter === 'active' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFilter('active')}
                >
                  Active
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${
                    activeFilter === 'inactive' 
                      ? 'bg-gray-100 text-gray-700 border border-gray-300' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFilter('inactive')}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="p-6">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No contacts found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-4 border-b flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{contact.firstName} {contact.lastName}</h3>
                        <p className="text-sm text-gray-500">{contact.position} at {contact.company}</p>
                      </div>
                      <span className={`h-fit px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last contacted: {new Date(contact.lastContactDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 text-sm">
                      <a href={`/contacts/${contact.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </a>
                      <a href={`/contacts/${contact.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}