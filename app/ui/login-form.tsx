'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { authenticate } from '../lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="rounded-b border border-t-0 border-line bg-surface px-6 pb-5 pt-7"
    >
      <h1 className="font-display text-2xl font-semibold text-ink">
        Sign in to your workspace
      </h1>
      <div className="mt-6 space-y-5">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted peer-focus:text-ink" />
          </div>
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              autoComplete="current-password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted peer-focus:text-ink" />
          </div>
        </div>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <Button className="mt-7 w-full" aria-disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
        <ArrowRightIcon className="ml-auto h-5 w-5" aria-hidden="true" />
      </Button>
      <div
        className="flex min-h-8 items-end gap-1.5 pt-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 shrink-0 text-danger" />
            <p className="text-sm text-danger">{errorMessage}</p>
          </>
        )}
      </div>
    </form>
  );
}
