import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New invoice',
};

export default async function Page(props: {
  searchParams?: Promise<{ customerId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const customers = await fetchCustomers();
  // "New invoice" on a client's page links here with ?customerId=...
  // Only pre-select it if it's one of this user's clients.
  const defaultCustomerId = customers.some(
    (c) => c.id === searchParams?.customerId,
  )
    ? searchParams?.customerId
    : undefined;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'New invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} defaultCustomerId={defaultCustomerId} />
    </main>
  );
}