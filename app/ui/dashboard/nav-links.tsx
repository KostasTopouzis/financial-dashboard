'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentTextIcon,
  },
  { name: 'Clients', href: '/dashboard/customers', icon: UserGroupIcon },
];

// Shared by nav links and the sign-out button so they line up exactly.
export const navItemClass =
  'flex h-11 w-full grow items-center justify-center gap-3 rounded px-3 text-sm font-medium text-on-brand-muted transition-colors hover:bg-brand-raised hover:text-on-brand focus-visible:outline-accent-soft md:flex-none md:justify-start';

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(navItemClass, {
              'bg-brand-raised font-semibold text-on-brand shadow-[inset_0_-2px_0_rgb(var(--color-accent-soft))] md:shadow-[inset_2px_0_0_rgb(var(--color-accent-soft))]':
                isActive,
            })}
          >
            <LinkIcon className="w-5" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
