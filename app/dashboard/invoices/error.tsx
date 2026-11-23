'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <ExclamationTriangleIcon className="w-10 text-danger" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold text-ink">
        Your invoices couldn’t be loaded
      </h2>
      <p className="text-muted">This is usually temporary. Please try again.</p>
      <button
        className="mt-4 rounded bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
