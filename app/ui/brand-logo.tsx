import clsx from 'clsx';
import { brand } from '@/app/lib/brand';

// Oval seal with the monogram. The initials are set well inside the inner
// ring so the mark keeps clear space at every size.
export function BrandSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden="true"
      className={clsx('shrink-0', className)}
    >
      <ellipse
        cx="28"
        cy="28"
        rx="26"
        ry="27"
        fill="none"
        stroke="rgb(var(--color-accent-soft))"
        strokeWidth="1.4"
      />
      <ellipse
        cx="28"
        cy="28"
        rx="22.5"
        ry="23.5"
        fill="none"
        stroke="rgb(var(--color-accent-soft))"
        strokeWidth="0.6"
      />
      <text
        x="28"
        y="33"
        textAnchor="middle"
        fontSize="15"
        fontWeight="600"
        style={{ fontFamily: 'var(--font-display)' }}
        fill="rgb(var(--color-on-brand))"
      >
        {brand.monogram.first}
        <tspan fill="rgb(var(--color-accent-soft))" fontWeight="500" dx="0.5">
          &amp;
        </tspan>
        <tspan dx="0.5">{brand.monogram.second}</tspan>
      </text>
    </svg>
  );
}

// Full lockup: seal + wordmark. Designed for brand-colored backgrounds.
export default function BrandLogo({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span className="flex items-center gap-3 leading-none text-on-brand">
      <BrandSeal
        className={clsx({
          'h-9 w-9': size === 'sm',
          'h-11 w-11': size === 'md',
          'h-14 w-14': size === 'lg',
        })}
      />
      <span
        className={clsx('whitespace-nowrap font-display font-semibold', {
          'text-xl': size === 'sm',
          'text-2xl': size === 'md',
          'text-3xl': size === 'lg',
        })}
      >
        Ashby <span className="font-medium text-accent-soft">&amp;</span> Vale
      </span>
    </span>
  );
}

// Optional decorative motif placed behind brand-colored panels
// (sidebar, landing hero). Ashby & Vale keeps those panels plain.
export function BrandPattern(_props: { className?: string }) {
  return null;
}
