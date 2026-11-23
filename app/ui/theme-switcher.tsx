'use client';

import { useSyncExternalStore } from 'react';
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {
  type ThemePreference,
  readThemePreference,
  setThemePreference,
  subscribeToThemePreference,
} from '@/app/lib/theme';

const options: {
  value: ThemePreference;
  label: string;
  icon: typeof SunIcon;
}[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
];

// The server can't read localStorage, so it renders no option selected.
// useSyncExternalStore then swaps in the real preference after hydration
// without a mismatch warning.
const getServerSnapshot = () => null;

// Segmented Light / Dark / System control for brand-colored panels.
// Native radios (visually hidden) give arrow-key navigation and correct
// screen-reader semantics for free.
export default function ThemeSwitcher({ className }: { className?: string }) {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    readThemePreference,
    getServerSnapshot,
  );

  return (
    <fieldset className={clsx('flex items-center', className)}>
      <legend className="sr-only">Color theme</legend>
      <span
        aria-hidden="true"
        className="hidden text-sm font-medium text-on-brand-muted md:block"
      >
        Theme
      </span>
      <div className="flex gap-0.5 rounded bg-brand-deep p-0.5">
        {options.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            title={label}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-on-brand-muted transition-colors hover:text-on-brand has-[:checked]:bg-brand-raised has-[:checked]:text-on-brand has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-accent-soft"
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={preference === value}
              onChange={() => setThemePreference(value)}
              className="sr-only"
            />
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
