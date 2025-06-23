'use client'; // asegúrate de que esté marcado como componente del cliente

import Link from 'next/link';
import NavLinks from '@/app/costos/ui/dashboard/nav-links';
import UUSMBLogo from '@/app/costos/ui/uusmb-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { logout } from '@/app/costos/ui/dashboard/logout'; // <-- importas la acción

export default function SideNav({ closeMenu }: { closeMenu: () => void }) {
  return (
    <div className="fixed h-full flex-col px-3 py-6 md:px-2 w-20 md:w-64 transition-all duration-300">
      <div className="flex grow flex-col justify-between space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={logout}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
