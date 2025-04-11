import { ReactNode } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}