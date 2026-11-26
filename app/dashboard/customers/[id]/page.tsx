import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CustomerAvatar from '@/app/ui/customers/avatar';
import {
  CreateInvoiceForCustomer,
  UpdateCustomer,
} from '@/app/ui/customers/buttons';
import DeleteCustomer from '@/app/ui/customers/delete-customer';
import InvoiceHistory from '@/app/ui/customers/invoice-history';
import { Card } from '@/app/ui/dashboard/cards';
import { fetchCustomerById, fetchCustomerInvoices } from '@/app/lib/data';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';

type Props = { params: Promise<{ id: string }> };

// The tab title shows the client's name. fetchCustomerById is cached per
// request, so the page below doesn't query the database a second time.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const customer = await fetchCustomerById(id);
  return { title: customer?.name ?? 'Client not found' };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Both queries only need the id, so run them in parallel.
  const [customer, invoices] = await Promise.all([
    fetchCustomerById(id),
    fetchCustomerInvoices(id),
  ]);

  // Unknown id, malformed id or another user's client: all look the same.
  if (!customer) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clients', href: '/dashboard/customers' },
          {
            label: customer.name,
            href: `/dashboard/customers/${customer.id}`,
            active: true,
          },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <CustomerAvatar
            name={customer.name}
            imageUrl={customer.image_url}
            size={64}
          />
          <div className="min-w-0">
            <a
              href={`mailto:${customer.email}`}
              className="block truncate text-ink underline-offset-4 hover:underline"
            >
              {customer.email}
            </a>
            <p className="text-sm text-muted">
              {customer.last_invoice_date
                ? `Last invoiced ${formatDateToLocal(customer.last_invoice_date)}`
                : 'Not invoiced yet'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <UpdateCustomer id={customer.id} />
          <CreateInvoiceForCustomer id={customer.id} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total billed"
          value={formatCurrency(customer.total_paid + customer.total_pending)}
          type="billed"
        />
        <Card
          title="Collected"
          value={formatCurrency(customer.total_paid)}
          type="collected"
        />
        <Card
          title="Outstanding"
          value={formatCurrency(customer.total_pending)}
          type="pending"
        />
        <Card title="Invoices" value={customer.total_invoices} type="invoices" />
      </div>

      <InvoiceHistory invoices={invoices} />

      <DeleteCustomer
        id={customer.id}
        name={customer.name}
        invoiceCount={customer.total_invoices}
      />
    </main>
  );
}
