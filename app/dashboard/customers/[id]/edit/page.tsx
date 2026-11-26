import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CustomerForm from '@/app/ui/customers/customer-form';
import { fetchCustomerById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit client',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const customer = await fetchCustomerById(id);

  // Renders the nearest not-found.tsx, which is in the [id] folder above.
  if (!customer) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clients', href: '/dashboard/customers' },
          { label: customer.name, href: `/dashboard/customers/${id}` },
          {
            label: 'Edit',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <CustomerForm
        customer={{
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
        }}
      />
    </main>
  );
}
