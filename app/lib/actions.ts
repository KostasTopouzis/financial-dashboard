'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { requireUser } from './dal';
import {
  type CheckedImage,
  deleteCustomerImage,
  readImageUpload,
  uploadCustomerImage,
} from './customer-images';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch(error) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require' });

// ---------------------------------------------------------------------------
// Sign-up
// ---------------------------------------------------------------------------

// bcrypt only looks at the first 72 bytes of a password and ignores the
// rest, so a longer one would give a false sense of strength. Bytes, not
// characters: an emoji or accented letter takes several bytes.
const BCRYPT_MAX_BYTES = 72;

const SignUpSchema = z
  .object({
    name: z
      .string({ invalid_type_error: 'Please enter your name.' })
      .trim()
      .min(1, { message: 'Please enter your name.' })
      .max(100, { message: 'Your name must be 100 characters or fewer.' }),
    // Stored exactly as typed: the part before "@" may be case-sensitive
    // on some mail servers (RFC 5321), so mail must go to the original
    // spelling. Uniqueness and login ignore case instead, through
    // lower(email) in the users_email_lower_key index and in auth.ts, so
    // "Amy@x.com" and "amy@x.com" are still one account.
    email: z
      .string({ invalid_type_error: 'Please enter an email address.' })
      .trim()
      .email({ message: 'Please enter a valid email address.' })
      .max(255, { message: 'The email must be 255 characters or fewer.' }),
    // Not trimmed: spaces are a legitimate part of a password.
    password: z
      .string({ invalid_type_error: 'Please choose a password.' })
      .min(8, { message: 'Use at least 8 characters.' })
      .refine(
        (p) => new TextEncoder().encode(p).length <= BCRYPT_MAX_BYTES,
        { message: 'The password is too long (72 bytes at most).' },
      ),
    confirmPassword: z.string({
      invalid_type_error: 'Please repeat your password.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignUpState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  // Refills the form after a failed submit. Passwords are never sent back.
  values?: { name: string; email: string };
};

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
  };

  const parsed = SignUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the highlighted fields.',
      values,
    };
  }

  const { name, email, password } = parsed.data;

  // Cost factor 10, the same as the seeded demo account.
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // No "does this email exist?" query first: two sign-ups could both
    // pass that check at the same moment. The unique constraint on email
    // is the single source of truth, and its error is turned into a
    // friendly message below.
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    if (isPgError(error, '23505')) {
      return {
        errors: {
          email: ['An account with this email already exists. Try signing in.'],
        },
        message: 'Failed to create account.',
        values,
      };
    }
    console.error(error);
    return { message: 'Database Error: Failed to create account.', values };
  }

  // The account exists, so sign the new user straight in. On success
  // signIn() redirects by throwing, which is why it sits outside the
  // try/catch above and why only AuthError is caught here.
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: 'Your account was created, but signing in failed. Please sign in.',
      };
    }
    throw error;
  }

  return {};
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
    // Server Actions are public HTTP endpoints, so each one checks who is
    // calling. This runs outside try/catch because redirect() works by
    // throwing, and the catch below would swallow it.
    const { id: userId } = await requireUser();

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        // If customerId belongs to another user, the composite foreign key
        // (customer_id, user_id) makes the database reject this insert.
        await sql`
            INSERT INTO invoices (customer_id, user_id, amount, status, date)
            VALUES (${customerId}, ${userId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        throw new Error('Database Error: Failed to Create Invoice.');
    }

    // Invoice changes also move the overview cards and customer totals.
    revalidatePath('/dashboard', 'layout');
    redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const { id: userId } = await requireUser();

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if(!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
 
  const amountInCents = amount * 100;
 
  let updated;
  try {
    // `AND user_id = ...` means an invoice id from another workspace
    // matches no rows, so nothing changes.
    updated = await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id} AND user_id = ${userId}
    `;
  } catch (error) {
    throw new Error('Database Error: Failed to Update Invoice.');
  }

  if (updated.count === 0) {
    return { message: 'Invoice not found. Failed to Update Invoice.' };
  }

  // Invoice changes also move the overview cards and customer totals.
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard/invoices');
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

const CustomerSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Please enter a name.' })
    .trim()
    .min(1, { message: 'Please enter a name.' })
    .max(100, { message: 'The name must be 100 characters or fewer.' }),
  email: z
    .string({ invalid_type_error: 'Please enter an email address.' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address.' })
    .max(255, { message: 'The email must be 255 characters or fewer.' }),
});

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image?: string[];
  };
  message?: string | null;
  // React resets a form after its action runs. Sending the typed values
  // back lets the form show them again instead of empty fields.
  values?: { name: string; email: string };
};

function submittedValues(formData: FormData) {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
  };
}

// Postgres reports constraint failures with a five-character SQLSTATE code.
// Matching on the code (and the constraint name) keeps the friendly
// message tied to the exact rule that failed.
function isPgError(error: unknown, code: string, constraint?: string) {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { code?: string; constraint_name?: string };
  return e.code === code && (!constraint || e.constraint_name === constraint);
}

const DUPLICATE_EMAIL: CustomerState = {
  errors: { email: ['You already have a client with this email address.'] },
  message: 'Failed to save client.',
};

// Validates the text fields and the optional photo together, so the form
// shows every problem at once instead of one per submit.
async function parseCustomerForm(formData: FormData) {
  const fields = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });
  const image = await readImageUpload(formData.get('image'));
  const imageError = image && 'error' in image ? image.error : undefined;

  if (!fields.success || imageError) {
    return {
      ok: false as const,
      state: {
        errors: {
          ...(fields.success ? {} : fields.error.flatten().fieldErrors),
          ...(imageError ? { image: [imageError] } : {}),
        },
        message: 'Please fix the highlighted fields.',
      } satisfies CustomerState,
    };
  }

  return {
    ok: true as const,
    data: fields.data,
    image: image as CheckedImage | null,
  };
}

// Customer names and photos appear on the overview, the invoice list and
// the customer pages, so refresh the whole dashboard section.
function revalidateCustomers() {
  revalidatePath('/dashboard', 'layout');
}

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
): Promise<CustomerState> {
  const { id: userId } = await requireUser();
  const values = submittedValues(formData);

  const parsed = await parseCustomerForm(formData);
  if (!parsed.ok) return { ...parsed.state, values };
  const { name, email } = parsed.data;

  // Upload first so the row is only written once the photo is safely
  // stored. If the insert then fails, the orphaned file is removed.
  let imageUrl: string | null = null;
  try {
    if (parsed.image) imageUrl = await uploadCustomerImage(userId, parsed.image);
  } catch (error) {
    console.error(error);
    return { message: 'The photo could not be uploaded. Please try again.', values };
  }

  let customerId: string;
  try {
    const [row] = await sql<{ id: string }[]>`
      INSERT INTO customers (user_id, name, email, image_url)
      VALUES (${userId}, ${name}, ${email}, ${imageUrl})
      RETURNING id
    `;
    customerId = row.id;
  } catch (error) {
    await deleteCustomerImage(userId, imageUrl);
    if (isPgError(error, '23505', 'customers_user_id_email_key')) {
      return { ...DUPLICATE_EMAIL, values };
    }
    console.error(error);
    return { message: 'Database Error: Failed to create client.', values };
  }

  revalidateCustomers();
  redirect(`/dashboard/customers/${customerId}`);
}

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
): Promise<CustomerState> {
  const { id: userId } = await requireUser();
  const values = submittedValues(formData);

  const parsed = await parseCustomerForm(formData);
  if (!parsed.ok) return { ...parsed.state, values };
  const { name, email } = parsed.data;
  const removeImage = formData.get('removeImage') === 'on';

  // Read the current photo first: the owner check happens here, and the
  // old URL is needed to clean up the file if it gets replaced.
  const [current] = await sql<{ image_url: string | null }[]>`
    SELECT image_url FROM customers WHERE id = ${id} AND user_id = ${userId}
  `;
  if (!current) {
    return { message: 'Client not found. Failed to save client.', values };
  }

  let imageUrl = removeImage ? null : current.image_url;
  try {
    if (parsed.image) imageUrl = await uploadCustomerImage(userId, parsed.image);
  } catch (error) {
    console.error(error);
    return { message: 'The photo could not be uploaded. Please try again.', values };
  }

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${imageUrl}
      WHERE id = ${id} AND user_id = ${userId}
    `;
  } catch (error) {
    if (parsed.image) await deleteCustomerImage(userId, imageUrl);
    if (isPgError(error, '23505', 'customers_user_id_email_key')) {
      return { ...DUPLICATE_EMAIL, values };
    }
    console.error(error);
    return { message: 'Database Error: Failed to save client.', values };
  }

  // The row now points at the new photo (or none), so the old file can go.
  if (imageUrl !== current.image_url) {
    await deleteCustomerImage(userId, current.image_url);
  }

  revalidateCustomers();
  redirect(`/dashboard/customers/${id}`);
}

export type DeleteCustomerState = { message?: string | null };

export async function deleteCustomer(
  id: string,
  prevState: DeleteCustomerState,
): Promise<DeleteCustomerState> {
  const { id: userId } = await requireUser();

  let deleted: { image_url: string | null } | undefined;
  try {
    // The database is the final judge: invoices_customer_owner_fkey refuses
    // to delete a customer that invoices still point at. The UI disables
    // the button in that case, but this also covers a stale page or a
    // hand-crafted request.
    [deleted] = await sql<{ image_url: string | null }[]>`
      DELETE FROM customers
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING image_url
    `;
  } catch (error) {
    if (isPgError(error, '23503')) {
      return {
        message:
          'This client still has invoices. Delete or reassign them first.',
      };
    }
    console.error(error);
    return { message: 'Database Error: Failed to delete client.' };
  }

  if (!deleted) {
    return { message: 'Client not found. It may already have been deleted.' };
  }

  await deleteCustomerImage(userId, deleted.image_url);
  revalidateCustomers();
  redirect('/dashboard/customers');
}

export async function deleteInvoice(id: string) {
  const { id: userId } = await requireUser();

  try {
    await sql`DELETE FROM invoices WHERE id = ${id} AND user_id = ${userId}`;
  } catch (error) {
    console.error(error);
    throw new Error('Database Error: Failed to Delete Invoice.');
  }

  // Invoice changes also move the overview cards and customer totals.
  revalidatePath('/dashboard', 'layout');
}