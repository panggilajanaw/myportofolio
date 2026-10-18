/**
 * KUROZ4PH portfolio — Tailwind configuration.
 *
 * This is the original Stitch configuration (same token names, spacing, radii,
 * font families and type scale) with ONE structural change: every colour now
 * points at a CSS variable (see css/style.css, "THEME TOKENS"). That is what
 * lets the same utility classes (bg-surface, text-primary, ...) switch between
 * the dark theme (default, identical to the Stitch hex values) and a purpose
 * designed light theme without duplicating any markup.
 *
 * Rebuild the compiled stylesheet after editing classes in index.html or js/*.js:
 *   npm install && npm run build:css
 */

// rgb(var(--c-primary) / <alpha-value>) keeps opacity modifiers such as bg-primary/40 working.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

const colorNames = [
  'background', 'surface', 'surface-dim', 'surface-bright', 'surface-variant', 'surface-tint',
  'surface-container-lowest', 'surface-container-low', 'surface-container',
  'surface-container-high', 'surface-container-highest',
  'on-background', 'on-surface', 'on-surface-variant',
  'outline', 'outline-variant',
  'inverse-surface', 'inverse-on-surface', 'inverse-primary',
  'primary', 'on-primary', 'primary-container', 'on-primary-container',
  'primary-fixed', 'primary-fixed-dim', 'on-primary-fixed', 'on-primary-fixed-variant',
  'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
  'secondary-fixed', 'secondary-fixed-dim', 'on-secondary-fixed', 'on-secondary-fixed-variant',
  'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
  'tertiary-fixed', 'tertiary-fixed-dim', 'on-tertiary-fixed', 'on-tertiary-fixed-variant',
  'error', 'on-error', 'error-container', 'on-error-container',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  // Hover styles only apply on devices that can really hover, so touch screens never get "stuck" hover states.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: Object.fromEntries(colorNames.map((n) => [n, token(n)])),
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem', // Stitch value (kept so original panels look the same)
        pill: '9999px', // true pill / circle, used where the brief asks for a pill-shaped control
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-sm': '1rem',
        'space-lg': '1.75rem',
        'margin-lg': '4rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'margin-sm': '1.25rem',
        'gutter-lg': '2rem',
        'space-md': '1rem',
        margin: '2rem',
        'space-xl': '3rem',
      },
      fontFamily: {
        'label-tech': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-sm': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-md-mobile': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'title-editorial': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-md': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body-lg': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'label-caps': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-lg': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-lg-mobile': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-sm': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display-hero': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display-hero-mobile': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'headline-md': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-tech': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
        'body-sm': ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }],
        'headline-md-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-editorial': ['16px', { lineHeight: '24px', letterSpacing: '0.08em', fontWeight: '600' }],
        'body-md': ['15px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.15em', fontWeight: '600' }],
        'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline-lg-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-hero': ['84px', { lineHeight: '92px', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-hero-mobile': ['44px', { lineHeight: '48px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'headline-md': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
