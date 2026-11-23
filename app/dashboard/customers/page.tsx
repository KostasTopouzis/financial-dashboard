import { Metadata } from 'next';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/app/ui/page-header';

export const metadata: Metadata = {
    title: 'Clients',
};

export default function Page() {
    return (
        <main>
            <PageHeader
                eyebrow="Directory"
                title="Clients"
                description="Everyone you invoice, with their paid and outstanding balances."
            />
            <div className="flex flex-col items-center rounded border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
                <UserGroupIcon className="h-10 w-10 text-accent" aria-hidden="true" />
                <p className="mt-4 font-display text-xl font-semibold text-ink">
                    The client directory isn’t available yet
                </p>
                <p className="mt-1 max-w-md text-muted">
                    Client balances will appear here once this page is connected to your records.
                </p>
            </div>
        </main>
    );
}
