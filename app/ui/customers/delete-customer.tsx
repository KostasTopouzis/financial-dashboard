'use client';

import { useActionState, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteCustomer, DeleteCustomerState } from '@/app/lib/actions';

const dangerButtonClass =
  'flex h-10 items-center gap-2 rounded border border-danger/40 bg-surface px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger-bg disabled:cursor-not-allowed disabled:opacity-60';

// Deleting is a two-step action: the first click asks for confirmation,
// the second submits. A client with invoices can't be deleted at all;
// the button explains why, and the Server Action refuses it regardless.
export default function DeleteCustomer({
  id,
  name,
  invoiceCount,
}: {
  id: string;
  name: string;
  invoiceCount: number;
}) {
  const deleteWithId = deleteCustomer.bind(null, id);
  const initialState: DeleteCustomerState = { message: null };
  const [state, formAction, isPending] = useActionState(
    deleteWithId,
    initialState,
  );
  const [confirming, setConfirming] = useState(false);

  const blocked = invoiceCount > 0;

  return (
    <section
      aria-labelledby="delete-client-heading"
      className="mt-8 rounded border border-danger/30 bg-surface p-5"
    >
      <h2
        id="delete-client-heading"
        className="font-display text-xl font-semibold text-ink"
      >
        Delete client
      </h2>
      <p id="delete-client-help" className="mt-1 max-w-prose text-sm text-muted">
        {blocked
          ? `${name} still has ${invoiceCount} ${invoiceCount === 1 ? 'invoice' : 'invoices'}. Delete them or move them to another client before deleting this client, so no invoice loses its client.`
          : `This permanently removes ${name} and their photo. It can’t be undone.`}
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
        {confirming ? (
          <>
            <p className="text-sm font-semibold text-ink" role="alert">
              Delete {name}?
            </p>
            <button
              type="submit"
              className={`${dangerButtonClass} border-danger bg-danger-bg`}
              disabled={isPending}
            >
              <TrashIcon className="w-4" aria-hidden="true" />
              {isPending ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex h-10 items-center rounded border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-sunken"
            >
              Keep client
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={blocked}
            aria-describedby="delete-client-help"
            className={dangerButtonClass}
          >
            <TrashIcon className="w-4" aria-hidden="true" />
            Delete client
          </button>
        )}
      </form>

      <div aria-live="polite" aria-atomic="true">
        {state.message ? (
          <p className="mt-3 text-sm text-danger">{state.message}</p>
        ) : null}
      </div>
    </section>
  );
}
