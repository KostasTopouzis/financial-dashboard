// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-surface/60 before:to-transparent motion-reduce:before:hidden';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded border border-line border-t-2 border-t-line-strong bg-surface px-5 pb-5 pt-4`}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded-sm bg-line" />
        <div className="h-5 w-5 rounded-sm bg-line" />
      </div>
      <div className="mt-4 h-9 w-28 rounded-sm bg-line" />
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden rounded border border-line bg-surface p-5 md:col-span-4`}>
      <div className="mb-5 h-7 w-28 rounded-sm bg-line" />
      <div>
        <div className="h-[380px] rounded-sm bg-surface-sunken" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-line" />
          <div className="ml-2 h-4 w-20 rounded-sm bg-line" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-line py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-line" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-sm bg-line" />
          <div className="mt-2 h-4 w-12 rounded-sm bg-line" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-sm bg-line" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden rounded border border-line bg-surface p-5 md:col-span-4`}
    >
      <div className="mb-3 h-7 w-40 rounded-sm bg-line" />
      <div className="flex grow flex-col justify-between">
        <div>
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-line" />
          <div className="ml-2 h-4 w-20 rounded-sm bg-line" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div className="mb-8 border-b border-line pb-6">
        <div className="mb-3 h-3 w-20 rounded-sm bg-line" />
        <div className="h-10 w-72 max-w-full rounded-sm bg-line" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-line last-of-type:border-none">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-line"></div>
          <div className="h-6 w-24 rounded bg-line"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-line"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-line"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-line"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-line"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-line"></div>
          <div className="h-[38px] w-[38px] rounded bg-line"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="w-full border-b border-line p-4">
      <div className="flex items-center justify-between border-b border-line pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-line"></div>
          <div className="h-6 w-16 rounded bg-line"></div>
        </div>
        <div className="h-6 w-16 rounded bg-line"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-line"></div>
          <div className="mt-2 h-6 w-24 rounded bg-line"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-line"></div>
          <div className="h-10 w-10 rounded bg-line"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded border border-line bg-surface">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-ink md:table">
            <thead className="border-b border-line bg-surface-sunken text-left text-xs uppercase tracking-label text-muted">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
