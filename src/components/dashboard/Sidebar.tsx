import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  FolderIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import { useProfile } from '../../contexts/ProfileContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Companies', href: '/companies', icon: BuildingOffice2Icon },
  { name: 'Deals', href: '/deals', icon: CurrencyDollarIcon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const fileItems = [
  { name: 'File Manager', href: '/files', icon: FolderIcon },
  { name: 'Prospects', href: '/prospects', icon: TableCellsIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { profileImage } = useProfile();
  
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="bg-slate-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-4 h-16 flex items-center border-b border-slate-700">
        <h1 className="text-xl font-bold">Suzali CRM</h1>
      </div>
      <div className="p-4">
        {/* User Profile Section */}
        <div className="mb-4 pb-4 border-b border-slate-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white relative overflow-hidden">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <span>{session?.user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-slate-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="space-y-1">
          <div className="mb-2">
            <p className="text-xs text-slate-400 uppercase mb-1">Main Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Fichiers Section */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 uppercase mb-1">Fichiers</p>
            {fileItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 mt-4"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
}