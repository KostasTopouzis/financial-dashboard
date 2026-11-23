import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="grow px-4 py-6 md:overflow-y-auto md:px-12 md:py-10">
                <div className="mx-auto max-w-6xl">{children}</div>
            </div>
        </div>
    );
}
