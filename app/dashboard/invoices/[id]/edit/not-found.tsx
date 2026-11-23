import Link from 'next/link';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <DocumentMagnifyingGlassIcon className="w-10 text-accent" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold text-ink">
        Invoice not found
      </h2>
      <p className="text-muted">
        It may have been deleted, or the link may be incorrect.
      </p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-deep"
      >
        Back to invoices
      </Link>
    </main>
  );
}
