import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { secondaryActionClass } from '@/app/ui/button';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 shrink-0 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
    >
      <PlusIcon className="h-5" aria-hidden="true" />
      <span className="sr-only md:not-sr-only">New client</span>
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className={`${secondaryActionClass} gap-2`}
    >
      <PencilIcon className="w-4" aria-hidden="true" />
      Edit client
    </Link>
  );
}

// Starts a new invoice with this client already selected.
export function CreateInvoiceForCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/create?customerId=${id}`}
      className="flex h-10 shrink-0 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
    >
      <PlusIcon className="h-5" aria-hidden="true" />
      New invoice
    </Link>
  );
}
