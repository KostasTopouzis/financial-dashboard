import { CheckIcon, ClockIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-pending-bg text-pending-fg': status === 'pending',
          'bg-paid-bg text-paid-fg': status === 'paid',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Pending
        </>
      ) : null}
      {status === 'paid' ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Paid
        </>
      ) : null}
    </span>
  );
}
