import { fetchCardData } from '@/app/lib/data';

import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  billed: ReceiptPercentIcon,
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: DocumentTextIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Outstanding" value={totalPendingInvoices} type="pending" />
      <Card title="Invoices" value={numberOfInvoices} type="invoices" />
      <Card title="Clients" value={numberOfCustomers} type="customers" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: keyof typeof iconMap;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded border border-line border-t-2 border-t-accent bg-surface px-5 pb-5 pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="eyebrow">{title}</h3>
        {Icon ? <Icon className="h-5 w-5 text-muted" aria-hidden="true" /> : null}
      </div>
      <p className="mt-4 truncate text-3xl font-semibold font-figures tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}
