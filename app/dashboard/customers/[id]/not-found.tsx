import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// Shown when the customer page or its edit page calls notFound().
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <UserCircleIcon className="w-10 text-accent" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold text-ink">
        Client not found
      </h2>
      <p className="text-muted">
        They may have been deleted, or the link may be incorrect.
      </p>
      <Link
        href="/dashboard/customers"
        className="mt-4 rounded bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        Back to clients
      </Link>
    </main>
  );
}
