import type { Config } from 'tailwindcss';

// Semantic colors resolve to CSS variables defined by the active theme file
// in app/ui/themes/. Keep component classes on these names so the brand
// (and later dark mode) can change without touching components.
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  // Tokens handle almost everything. `dark:` is for rare one-off tweaks and
  // follows the attribute set by the theme script, not the OS media query,
  // so a user's manual choice wins.
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        canvas: token('canvas'),
        surface: {
          DEFAULT: token('surface'),
          sunken: token('surface-sunken'),
        },
        ink: token('ink'),
        muted: token('muted'),
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
        },
        brand: {
          DEFAULT: token('brand'),
          deep: token('brand-deep'),
          raised: token('brand-raised'),
        },
        'on-brand': {
          DEFAULT: token('on-brand'),
          muted: token('on-brand-muted'),
        },
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
        },
        'on-primary': token('on-primary'),
        accent: {
          DEFAULT: token('accent'),
          soft: token('accent-soft'),
        },
        paid: {
          bg: token('paid-bg'),
          fg: token('paid-fg'),
        },
        pending: {
          bg: token('pending-bg'),
          fg: token('pending-fg'),
        },
        danger: {
          DEFAULT: token('danger'),
          bg: token('danger-bg'),
        },
        focus: token('focus'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Garamond', 'Georgia', 'serif'],
        // Amounts, dates and counts. Each theme decides the face.
        figures: ['var(--font-figures)', 'var(--font-sans)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      letterSpacing: {
        label: '0.12em',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
