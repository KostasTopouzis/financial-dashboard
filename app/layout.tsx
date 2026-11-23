import '@/app/ui/themes/ashby-vale.css';
import '@/app/ui/global.css';
import { displayFont, sansFont } from '@/app/ui/fonts';
import { brand } from '@/app/lib/brand';
import { themeInitScript } from '@/app/lib/theme';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    template: `%s | ${brand.name}`,
    default: brand.name,
  },
  description: brand.description,
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// Browser UI color (mobile address bar). These follow the OS setting only;
// the meta tag cannot see a manual override, which is an accepted gap.
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F2EE' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1513' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The theme script sets data-theme on <html> before React hydrates,
    // so the server and client attributes differ on purpose.
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
