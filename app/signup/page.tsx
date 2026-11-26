import BrandLogo from '@/app/ui/brand-logo';
import SignUpForm from '@/app/ui/signup-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/app/lib/brand';

export const metadata: Metadata = {
  title: 'Create an account',
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="rounded-t bg-brand px-6 py-7">
          <Link href="/" aria-label={`${brand.name} home`} className="inline-block">
            <BrandLogo size="md" />
          </Link>
          <p className="mt-4 text-sm text-on-brand-muted">{brand.tagline}</p>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
