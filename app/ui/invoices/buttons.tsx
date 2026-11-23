import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 shrink-0 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
    >
      <PlusIcon className="h-5" aria-hidden="true" />
      <span className="sr-only md:not-sr-only">New invoice</span>
    </Link>
  );
}

const rowActionClass =
  'flex h-9 w-9 items-center justify-center rounded border border-line text-muted transition-colors hover:bg-surface hover:text-ink';

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/invoices/${id}/edit`} className={rowActionClass}>
      <span className="sr-only">Edit invoice</span>
      <PencilIcon className="w-4" aria-hidden="true" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button
        type="submit"
        className={`${rowActionClass} hover:border-danger/40 hover:bg-danger-bg hover:text-danger`}
      >
        <span className="sr-only">Delete invoice</span>
        <TrashIcon className="w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
