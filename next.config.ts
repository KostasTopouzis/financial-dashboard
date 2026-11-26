import type { NextConfig } from 'next';

// Customer photos are served from the project's Supabase Storage bucket
// (see app/lib/customer-images.ts). next/image only optimises remote
// images from hosts listed here, so allow exactly that bucket.
const customerImages = process.env.SUPABASE_URL
  ? [
      new URL(
        `${process.env.SUPABASE_URL}/storage/v1/object/public/customer-avatars/**`,
      ),
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: customerImages,
  },
  experimental: {
    serverActions: {
      // Photos may be up to 1 MB. The default Server Action body limit is
      // also 1 MB, and the form fields and multipart framing add to that.
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
