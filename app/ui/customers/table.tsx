import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { fetchFilteredCustomers } from '@/app/lib/data';
import CustomerAvatar from '@/app/ui/customers/avatar';

export default async function CustomersTable({ query }: { query: string }) {
  const customers = await fetchFilteredCustomers(query);

  if (customers.length === 0) {
    return (
      <div className="mt-6 rounded border border-line bg-surface px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold text-ink">
          No clients found
        </p>
        <p className="mt-1 text-muted">
          {query
            ? 'Try a different name or email address.'
            : 'Add your first client to start invoicing them.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded border border-line bg-surface">
      {/* Small screens: stacked records, each one a link */}
      <ul className="divide-y divide-line md:hidden">
        {customers.map((customer) => (
          <li key={customer.id}>
            <Link
              href={`/dashboard/customers/${customer.id}`}
              className="block p-4 transition-colors hover:bg-surface-sunken"
            >
              <div className="flex items-center gap-3">
                <CustomerAvatar
                  name={customer.name}
                  imageUrl={customer.image_url}
                  size={32}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {customer.name}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {customer.email}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted" aria-hidden="true" />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="eyebrow">Invoices</dt>
                  <dd className="mt-1 font-figures tabular-nums text-ink">
                    {customer.total_invoices}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Outstanding</dt>
                  <dd className="mt-1 font-figures tabular-nums text-ink">
                    {customer.total_pending}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Paid</dt>
                  <dd className="mt-1 font-figures tabular-nums text-ink">
                    {customer.total_paid}
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>

      {/* Medium screens and up: table. The name links to the client page. */}
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
                Invoices
              </th>
              <th scope="col" className="eyebrow px-3 py-3 text-right">
                Outstanding
              </th>
              <th scope="col" className="eyebrow py-3 pl-3 pr-6 text-right">
                Paid
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-surface-sunken"
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="flex items-center gap-3 font-semibold underline-offset-4 hover:underline"
                  >
                    <CustomerAvatar
                      name={customer.name}
                      imageUrl={customer.image_url}
                    />
                    {customer.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-muted">
                  {customer.email}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-figures tabular-nums">
                  {customer.total_invoices}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-figures tabular-nums">
                  {customer.total_pending}
                </td>
                <td className="whitespace-nowrap py-3 pl-3 pr-6 text-right font-semibold font-figures tabular-nums">
                  {customer.total_paid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
