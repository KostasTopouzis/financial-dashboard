import BrandLogo, { BrandPattern } from '@/app/ui/brand-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { brand } from '@/app/lib/brand';

const principles = [
  {
    title: 'Clarity',
    body: 'Collected, outstanding and recent invoices on one page, set out so the figures that matter are read first.',
  },
  {
    title: 'Security',
    body: 'Your workspace sits behind a personal sign-in. Nothing is shown until you have identified yourself.',
  },
  {
    title: 'Reliability',
    body: 'Twelve months of revenue kept in order, so the shape of your year is always to hand.',
  },
  {
    title: 'Ease',
    body: 'Issue, amend and settle invoices in a few plain steps, without accounting jargon.',
  },
];

export default function Page() {
  return (
    <main className="grid min-h-screen md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className="relative flex flex-col justify-between gap-16 overflow-hidden bg-brand px-6 py-10 text-on-brand md:px-14 md:py-14">
        <BrandPattern className="pointer-events-none absolute -right-40 -top-40 w-[34rem]" />
        <div className="relative">
          <BrandLogo size="lg" />
        </div>

        <div className="relative max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-label text-accent-soft">
            For independent professionals
          </p>
          <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] md:text-6xl">
            {brand.tagline}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-on-brand-muted">
            {brand.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 rounded bg-accent-soft px-6 py-3 font-semibold text-brand-deep transition-colors hover:bg-on-brand focus-visible:outline-accent-soft"
            >
              Sign in to your workspace
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/signup"
              className="font-semibold text-on-brand underline underline-offset-4 transition-colors hover:text-accent-soft focus-visible:outline-accent-soft"
            >
              Create an account
            </Link>
          </div>
        </div>

        <p className="relative text-sm text-on-brand-muted">
          Invoices · Clients · Revenue
        </p>
      </section>

      <section
        aria-labelledby="principles-heading"
        className="flex items-center px-6 py-14 md:px-16"
      >
        <div className="w-full max-w-xl">
          <h2
            id="principles-heading"
            className="font-display text-3xl font-semibold text-ink"
          >
            How we keep your accounts
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="border-t-2 border-accent pt-4">
                <dt className="font-display text-xl font-semibold text-ink">
                  {item.title}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
