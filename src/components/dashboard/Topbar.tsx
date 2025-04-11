import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MagnifyingGlassIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Topbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4">
      <button
        className="md:hidden text-gray-500 mr-4"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      
      <div className="flex-1">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="relative">
          <div className="flex items-center cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <span className="ml-2 text-sm font-medium hidden md:block">
              {session?.user?.name || 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 text-white">
            <div className="p-4 h-16 flex items-center justify-between border-b border-slate-700">
              <h1 className="text-xl font-bold">Suzali CRM</h1>
              <button
                className="text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Mobile menu content - to be filled with the same items as sidebar */}
          </div>
        </div>
      )}
    </header>
  );
}