import CustomerAvatar from '@/app/ui/customers/avatar';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  if (!invoices || invoices.length === 0) {
    return (
      <div className="mt-6 rounded border border-line bg-surface px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold text-ink">
          No invoices found
        </p>
        <p className="mt-1 text-muted">
          {query
            ? 'Try a different name, email, amount or date.'
            : 'Create your first invoice to see it listed here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded border border-line bg-surface">
      {/* Small screens: stacked records */}
      <ul className="divide-y divide-line md:hidden">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <CustomerAvatar name={invoice.name} imageUrl={invoice.image_url} size={32} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {invoice.name}
                  </p>
                  <p className="truncate text-sm text-muted">{invoice.email}</p>
                </div>
              </div>
              <InvoiceStatus status={invoice.status} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xl font-semibold font-figures tabular-nums text-ink">
                  {formatCurrency(invoice.amount)}
                </p>
                <p className="text-sm text-muted">
                  {formatDateToLocal(invoice.date)}
                </p>
              </div>
              <div className="flex gap-2">
                <UpdateInvoice id={invoice.id} />
                <DeleteInvoice id={invoice.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Medium screens and up: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm text-ink">
          <thead className="border-b border-line bg-surface-sunken text-left">
            <tr>
              <th scope="col" className="eyebrow px-6 py-3">
                Client
              </th>
              <th scope="col" className="eyebrow px-3 py-3">
                Email
              </th>
              <th scope="col" className="eyebrow px-3 py-3 text-right">
                Amount
              </th>
              <th scope="col" className="eyebrow px-3 py-3">
                Date
              </th>
              <th scope="col" className="eyebrow px-3 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
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
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <CustomerAvatar name={invoice.name} imageUrl={invoice.image_url} size={28} />
                    <span className="font-semibold">{invoice.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted">
                  {invoice.email}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold font-figures tabular-nums">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-figures tabular-nums text-muted">
                  {formatDateToLocal(invoice.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <InvoiceStatus status={invoice.status} />
                </td>
                <td className="whitespace-nowrap py-3 pl-3 pr-6">
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
    </div>
  );
}
