'use client';

import {
  HomeIcon,
  BeakerIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
  CubeIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  {
    name: 'Inicio',
    href: '/costos/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Consumibles',
    href: '/costos/dashboard/consumibles',
    icon: BeakerIcon,
  },
  {
    name: 'Reactivos',
    href: '/costos/dashboard/reactivos',
    icon: BeakerIcon,
  },
  {
    name: 'Cuantificaciones',
    href: '/costos/dashboard/cuantificaciones',
    icon: ChartBarIcon,
  },
  {
    name: 'Cuantificacion-Consumible',
    href: '/costos/dashboard/cuantificacion-consumible',
    icon: PuzzlePieceIcon,
  },
  {
    name: 'Buffer/Geles/Oligos',
    href: '/costos/dashboard/buffer-geles-oligos',
    icon: CubeIcon,
  },
  {
    name: 'BGO-Consumibles',
    href: '/costos/dashboard/bgo-consumibles',
    icon: PuzzlePieceIcon,
  },
  {
    name: 'Procesos',
    href: '/costos/dashboard/procesos',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Procesos-Material',
    href: '/costos/dashboard/procesos-material',
    icon: PuzzlePieceIcon,
  },
  {
    name: 'Servicios',
    href: '/costos/dashboard/servicios',
    icon: ClipboardIcon,
  },
  {
    name: 'Servicios-Procesos',
    href: '/costos/dashboard/servicios-procesos',
    icon: ClipboardDocumentListIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors duration-200',
              isActive
                ? 'bg-sky-100 text-blue-600'
                : 'text-gray-700 hover:bg-sky-100 hover:text-blue-600'
            )}
          >
            <LinkIcon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
