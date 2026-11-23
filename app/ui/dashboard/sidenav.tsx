import Link from 'next/link';
import NavLinks, { navItemClass } from '@/app/ui/dashboard/nav-links';
import BrandLogo, { BrandPattern } from '@/app/ui/brand-logo';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { brand } from '@/app/lib/brand';

export default function SideNav() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-brand px-3 py-4 md:px-4 md:py-8">
      <BrandPattern className="pointer-events-none absolute -bottom-24 -right-28 hidden w-80 md:block" />
      <Link
        className="relative mb-4 flex items-center rounded px-2 py-1 focus-visible:outline-accent-soft md:mb-10"
        href="/"
        aria-label={`${brand.name} home`}
      >
        <BrandLogo size="sm" />
      </Link>
      <nav
        aria-label="Main"
        className="relative flex grow flex-row gap-2 md:flex-col md:gap-1"
      >
        <NavLinks />
        <div className="hidden grow md:block" />
        <form
          className="flex grow md:grow-0"
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className={navItemClass}>
            <ArrowRightStartOnRectangleIcon className="w-5" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Sign out</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
