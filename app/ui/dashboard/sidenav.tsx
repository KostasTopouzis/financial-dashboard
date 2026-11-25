import Link from 'next/link';
import NavLinks, { navItemClass } from '@/app/ui/dashboard/nav-links';
import BrandLogo, { BrandPattern } from '@/app/ui/brand-logo';
import ThemeSwitcher from '@/app/ui/theme-switcher';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { brand } from '@/app/lib/brand';
import { requireUser } from '@/app/lib/dal';

export default async function SideNav() {
  const user = await requireUser();

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
      {/* Whose workspace this is. Hidden on mobile to keep the top bar short. */}
      <div className="relative mb-6 hidden border-l-2 border-accent-soft pl-3 md:block">
        <p className="text-xs uppercase tracking-wider text-on-brand-muted">
          Workspace
        </p>
        <p className="truncate font-semibold text-on-brand">
          {user.name ?? 'My workspace'}
        </p>
        {user.email ? (
          <p className="truncate text-sm text-on-brand-muted">{user.email}</p>
        ) : null}
      </div>
      <nav
        aria-label="Main"
        className="relative flex grow flex-row gap-2 md:flex-col md:gap-1"
      >
        <NavLinks />
        <div className="hidden grow md:block" />
        <ThemeSwitcher className="shrink-0 md:mb-2 md:justify-between md:pl-3" />
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
