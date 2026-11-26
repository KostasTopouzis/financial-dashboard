// Customer photos are stored in Supabase Storage, which comes with the
// project's Supabase Postgres database. A server can't keep uploads on its
// own disk on Vercel (the file system is read-only and not shared between
// instances), so files go to object storage and the database only keeps
// the public URL.
//
// This module talks to the Storage REST API with fetch, so no SDK is
// needed. It uses the service role key, which bypasses Supabase's access
// rules, so it must only ever run on the server.
import 'server-only';
import { randomUUID } from 'node:crypto';

export const CUSTOMER_IMAGE_BUCKET = 'customer-avatars';
export const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${CUSTOMER_IMAGE_BUCKET}/`;

type ImageType = { ext: 'png' | 'jpg' | 'webp'; contentType: string };

// The browser's `file.type` comes from the file name and can be faked, so
// look at the first bytes of the file instead ("magic numbers").
function detectImageType(bytes: Uint8Array): ImageType | null {
  const startsWith = (sig: number[], offset = 0) =>
    sig.every((byte, i) => bytes[offset + i] === byte);

  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ext: 'png', contentType: 'image/png' };
  }
  if (startsWith([0xff, 0xd8, 0xff])) {
    return { ext: 'jpg', contentType: 'image/jpeg' };
  }
  // "RIFF" .... "WEBP"
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { ext: 'webp', contentType: 'image/webp' };
  }
  return null;
}

export type CheckedImage = { bytes: Uint8Array; type: ImageType };

// An empty file input still sends a File with size 0, which means "no new
// photo". Returns null for that case, or an error message for a bad file.
export async function readImageUpload(
  value: FormDataEntryValue | null,
): Promise<CheckedImage | null | { error: string }> {
  if (!(value instanceof File) || value.size === 0) return null;

  if (value.size > MAX_IMAGE_BYTES) {
    return { error: 'The photo must be 1 MB or smaller.' };
  }

  const bytes = new Uint8Array(await value.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return { error: 'Please upload a PNG, JPEG or WebP image.' };
  }
  return { bytes, type };
}

function authHeaders() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('Supabase Storage is not configured.');
  }
  return { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY };
}

// Files are grouped by owner (`<userId>/<random>.png`). The random name
// means a new photo gets a new URL, so browsers and the Next.js image
// cache never show the old one.
export async function uploadCustomerImage(
  userId: string,
  image: CheckedImage,
): Promise<string> {
  const path = `${userId}/${randomUUID()}.${image.type.ext}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${CUSTOMER_IMAGE_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': image.type.contentType,
        'Cache-Control': 'max-age=31536000',
      },
      body: image.bytes,
    },
  );
  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status}): ${await res.text()}`);
  }
  return PUBLIC_PREFIX + path;
}

// Removes a photo this app uploaded for this user. Seeded photos under
// /customers/... and anything outside the user's own folder are ignored.
// Best effort: a leftover file is harmless, so errors are only logged.
export async function deleteCustomerImage(
  userId: string,
  url: string | null | undefined,
) {
  if (!url?.startsWith(PUBLIC_PREFIX)) return;
  const path = url.slice(PUBLIC_PREFIX.length);
  if (!path.startsWith(`${userId}/`) || path.includes('..')) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${CUSTOMER_IMAGE_BUCKET}/${path}`,
      { method: 'DELETE', headers: authHeaders() },
    );
    if (!res.ok) console.error('Image delete failed:', res.status);
  } catch (error) {
    console.error('Image delete failed:', error);
  }
}

// Called by /seed. Creates the public bucket once; safe to run again.
// Storage enforces the size and type limits too, as a second line of
// defence behind the checks above.
export async function ensureCustomerImageBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: CUSTOMER_IMAGE_BUCKET,
      name: CUSTOMER_IMAGE_BUCKET,
      public: true,
      file_size_limit: MAX_IMAGE_BYTES,
      allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp'],
    }),
  });
  if (res.ok) return;

  const body = await res.text();
  // Storage answers 400/409 with "already exists" on later runs.
  if (/already exists|Duplicate/i.test(body)) return;
  throw new Error(`Could not create storage bucket (${res.status}): ${body}`);
}
