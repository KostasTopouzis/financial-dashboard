import { EB_Garamond, Source_Sans_3 } from 'next/font/google';

// Display face: headings, wordmark and the logo seal.
// EB Garamond keeps the classical Garamond tone of the brand while its
// roman ampersand stays conventional and its strokes hold up at small sizes.
export const displayFont = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Text face: body copy, labels, controls and all figures (tabular numerals).
export const sansFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
