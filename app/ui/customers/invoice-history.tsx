import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { CustomerInvoice } from '@/app/lib/definitions';

// Every invoice for one client, newest first. Reuses the invoice row
// actions, so editing or deleting works the same as on the Invoices page.
export default function InvoiceHistory({
  invoices,
}: {
  invoices: CustomerInvoice[];
}) {
  return (
    <section aria-labelledby="invoice-history-heading" className="mt-8">
      <h2
        id="invoice-history-heading"
        className="mb-3 font-display text-2xl font-semibold text-ink"
      >
        Invoice history
      </h2>

      {invoices.length === 0 ? (
        <div className="rounded border border-line bg-surface px-6 py-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No invoices yet
          </p>
          <p className="mt-1 text-muted">
            Invoices you issue to this client will be listed here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-line bg-surface">
          <table className="min-w-full text-sm text-ink">
            <thead className="border-b border-line bg-surface-sunken text-left">
              <tr>
                <th scope="col" className="eyebrow py-3 pl-4 pr-3 sm:pl-6">
                  Date
                </th>
                <th scope="col" className="eyebrow px-3 py-3 text-right">
                  Amount
                </th>
                <th scope="col" className="eyebrow px-3 py-3">
                  Status
                </th>
                <th scope="col" className="py-3 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-surface-sunken"
                >
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 font-figures tabular-nums text-muted sm:pl-6">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold font-figures tabular-nums">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-4 sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
