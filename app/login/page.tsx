import BrandLogo from '@/app/ui/brand-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/app/lib/brand';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="rounded-t bg-brand px-6 py-7">
          <Link href="/" aria-label={`${brand.name} home`} className="inline-block">
            <BrandLogo size="md" />
          </Link>
          <p className="mt-4 text-sm text-on-brand-muted">{brand.tagline}</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
