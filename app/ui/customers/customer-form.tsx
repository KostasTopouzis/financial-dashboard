'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { AtSymbolIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button, secondaryActionClass } from '@/app/ui/button';
import CustomerAvatar from '@/app/ui/customers/avatar';
import {
  createCustomer,
  updateCustomer,
  CustomerState,
} from '@/app/lib/actions';
import { Customer } from '@/app/lib/definitions';

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

// One form for both pages: with a `customer` it edits, without one it
// creates. The Server Action does the real validation; the `accept` and
// size hints here only save the user a round trip.
export default function CustomerForm({ customer }: { customer?: Customer }) {
  const action = customer
    ? updateCustomer.bind(null, customer.id)
    : createCustomer;
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Local preview of a newly chosen photo. The object URL points at the
  // file in browser memory and is released when it's no longer shown.
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // After a failed submit React has reset the form, which empties the file
  // input (browsers can't refill one), so the preview must go too.
  // Adjusting state during render when the action state changes is React's
  // recommended alternative to an effect for this.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    setPreview(null);
  }

  // Shown after a failed submit; otherwise the saved values (or empty).
  const values = state.values ?? {
    name: customer?.name ?? '',
    email: customer?.email ?? '',
  };
  const shownImage = removeImage ? null : customer?.image_url ?? null;

  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="rounded border border-line bg-surface p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-ink">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={values.name}
              placeholder="Client or company name"
              autoComplete="off"
              className="field-input peer"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted peer-focus:text-ink" aria-hidden="true" />
          </div>
          <FieldErrors id="name-error" errors={state.errors?.name} />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={values.email}
              placeholder="billing@example.com"
              autoComplete="off"
              className="field-input peer"
              aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted peer-focus:text-ink" aria-hidden="true" />
          </div>
          <FieldErrors id="email-error" errors={state.errors?.email} />
        </div>

        {/* Photo */}
        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-ink">
            Photo <span className="font-normal text-muted">(optional)</span>
          </legend>
          <div className="flex flex-wrap items-center gap-4 rounded border border-line-strong px-[14px] py-3">
            {/* A blob: URL can't go through next/image, so the preview uses a plain img. */}
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              <CustomerAvatar
                name={customer?.name ?? ''}
                imageUrl={shownImage}
                size={56}
              />
            )}
            <div className="min-w-0 flex-1">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-describedby="image-hint image-error"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-sm text-muted file:mr-3 file:cursor-pointer file:rounded file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-ink hover:file:bg-surface-sunken"
              />
              <p id="image-hint" className="mt-1 text-xs text-muted">
                PNG, JPEG or WebP, up to 1 MB.
              </p>
              {customer?.image_url && !preview ? (
                <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="removeImage"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong bg-surface text-primary focus:ring-primary focus:ring-offset-surface"
                  />
                  Remove current photo
                </label>
              ) : null}
            </div>
          </div>
          <FieldErrors id="image-error" errors={state.errors?.image} />
        </fieldset>
      </div>

      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.message ? (
          <p className="mt-2 text-sm text-danger">{state.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={customer ? `/dashboard/customers/${customer.id}` : '/dashboard/customers'}
          className={secondaryActionClass}
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={isPending} disabled={isPending}>
          {isPending ? 'Saving…' : customer ? 'Save changes' : 'Create client'}
        </Button>
      </div>
    </form>
  );
}
