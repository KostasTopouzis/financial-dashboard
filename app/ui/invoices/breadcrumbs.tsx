import { clsx } from 'clsx';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 border-b border-line pb-6">
      <ol className="flex flex-wrap items-baseline font-display text-3xl font-semibold md:text-4xl">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? 'page' : undefined}
            className={clsx(
              breadcrumb.active
                ? 'text-ink'
                : 'text-muted transition-colors hover:text-ink',
            )}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block font-normal text-line-strong" aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
