import { ArrowPathIcon } from '@heroicons/react/24/outline';
import CustomerAvatar from '@/app/ui/customers/avatar';
import { fetchLatestInvoices } from '@/app/lib/data';

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();

  return (
    <section
      aria-labelledby="latest-invoices-heading"
      className="flex w-full flex-col rounded border border-line bg-surface p-5 md:col-span-4"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2
          id="latest-invoices-heading"
          className="font-display text-2xl font-semibold text-ink"
        >
          Recent invoices
        </h2>
        <p className="text-sm text-muted">Latest five</p>
      </div>

      {latestInvoices.length === 0 ? (
        <p className="py-6 text-muted">No invoices issued yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {latestInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <CustomerAvatar name={invoice.name} imageUrl={invoice.image_url} size={36} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {invoice.name}
                  </p>
                  <p className="hidden truncate text-sm text-muted sm:block">
                    {invoice.email}
                  </p>
                </div>
              </div>
              <p className="shrink-0 font-semibold font-figures tabular-nums text-ink">
                {invoice.amount}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-sm text-muted">
        <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
        Updated just now
      </div>
    </section>
  );
}
