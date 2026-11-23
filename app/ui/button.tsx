import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Primary action button. Secondary links reuse `secondaryActionClass`.
export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center gap-2 rounded bg-brand px-4 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-deep active:bg-brand-deep aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
        className,
      )}
    >
      {children}
    </button>
  );
}

export const secondaryActionClass =
  'flex h-10 items-center rounded border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-sunken';
