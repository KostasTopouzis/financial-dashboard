import { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/app/ui/page-header';
import Search from '@/app/ui/search';
import CustomersTable from '@/app/ui/customers/table';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Clients',
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Directory"
        title="Clients"
        description="Everyone you invoice, with their paid and outstanding balances."
      />
      <div className="flex items-center justify-between gap-3">
        <Search placeholder="Search clients…" />
        <CreateCustomer />
      </div>
      {/* The key restarts the Suspense fallback on every new search. */}
      <Suspense key={query} fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} />
      </Suspense>
    </div>
  );
}
