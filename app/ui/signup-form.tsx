'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from './button';
import { signUp, SignUpState } from '../lib/actions';

const iconClass =
  'pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted peer-focus:text-ink';

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p className="mt-2 text-sm text-danger" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

// The browser checks `required`, `type="email"` and `minLength` first to
// save a round trip; the Server Action repeats every check, because a
// request can always be sent without this form.
export default function SignUpForm() {
  const initialState: SignUpState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const values = state.values ?? { name: '', email: '' };

  return (
    <form
      action={formAction}
      className="rounded-b border border-t-0 border-line bg-surface px-6 pb-5 pt-7"
    >
      <h1 className="font-display text-2xl font-semibold text-ink">
        Create your workspace
      </h1>
      <p className="mt-2 text-sm text-muted">
        Your invoices and clients stay private to your account.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="name">
            Name
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="name"
              type="text"
              name="name"
              defaultValue={values.name}
              placeholder="Your full name"
              autoComplete="name"
              required
              maxLength={100}
              aria-describedby="name-error"
            />
            <UserCircleIcon className={iconClass} aria-hidden="true" />
          </div>
          <FieldErrors id="name-error" errors={state.errors?.name} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="email"
              type="email"
              name="email"
              defaultValue={values.email}
              placeholder="you@example.com"
              autoComplete="email"
              required
              aria-describedby="email-error"
            />
            <AtSymbolIcon className={iconClass} aria-hidden="true" />
          </div>
          <FieldErrors id="email-error" errors={state.errors?.email} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
              aria-describedby="password-error"
            />
            <KeyIcon className={iconClass} aria-hidden="true" />
          </div>
          <FieldErrors id="password-error" errors={state.errors?.password} />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              className="field-input peer"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              minLength={8}
              aria-describedby="confirmPassword-error"
            />
            <KeyIcon className={iconClass} aria-hidden="true" />
          </div>
          <FieldErrors
            id="confirmPassword-error"
            errors={state.errors?.confirmPassword}
          />
        </div>
      </div>

      <Button className="mt-7 w-full" aria-disabled={isPending} disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create account'}
        <ArrowRightIcon className="ml-auto h-5 w-5" aria-hidden="true" />
      </Button>

      <div
        className="flex min-h-8 items-end gap-1.5 pt-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {state.message && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 shrink-0 text-danger" />
            <p className="text-sm text-danger">{state.message}</p>
          </>
        )}
      </div>

      <p className="mt-2 border-t border-line pt-4 text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-2 hover:text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
