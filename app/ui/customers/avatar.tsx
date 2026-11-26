import Image from 'next/image';
import clsx from 'clsx';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// A customer's photo, or their initials when they don't have one.
// Decorative by default (alt=""), because the name is always shown next to it.
export default function CustomerAvatar({
  name,
  imageUrl,
  size = 28,
  className,
}: {
  name: string;
  imageUrl: string | null;
  size?: number;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        className={clsx('shrink-0 rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full border border-line bg-surface-sunken font-semibold text-muted',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}
