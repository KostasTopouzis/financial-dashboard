import '@/app/ui/themes/ashby-vale.css';
import '@/app/ui/global.css';
import { displayFont, sansFont } from '@/app/ui/fonts';
import { brand } from '@/app/lib/brand';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: `%s | ${brand.name}`,
    default: brand.name,
  },
  description: brand.description,
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
