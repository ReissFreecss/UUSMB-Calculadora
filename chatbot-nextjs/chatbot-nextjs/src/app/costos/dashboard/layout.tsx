'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import QueryProvider from '@/context/QueryProvider';
import SideNav from '@/app/costos/ui/dashboard/sidenav';
import Loader from '@/components/features/Loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Esperamos hasta que se haya evaluado el contexto
    if (user === null) {
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [user]);

  if (checkingAuth) return <Loader />;

  return (
    <QueryProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav closeMenu={() => {}} />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </QueryProvider>
  );
}
