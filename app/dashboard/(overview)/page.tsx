import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import PageHeader from '@/app/ui/page-header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Overview',
};

export default async function Page() {
    return (
        <main>
            <PageHeader
                eyebrow="Overview"
                title="Statement of accounts"
                description="What has been collected, what is still outstanding, and who you have billed most recently."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                  <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                  <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                  <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}
