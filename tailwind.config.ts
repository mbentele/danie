import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Danie.de Brand Colors (from screenshots)
        brand: {
          primary: '#f1f5f9', // Light gray background
          secondary: '#ec4899', // Pink accent from logo
          dark: '#1f2937', // Dark gray header
        },
        border: '#e5e7eb', // Default border color for border-border class
        background: '#ffffff',
        foreground: '#1f2937',
      },
      fontFamily: {
        // Adobe Fonts integration
        'fatfrank': ['fatfrank', 'system-ui', 'sans-serif'],
        'hoss': ['hoss-round', 'system-ui', 'sans-serif'],
        'playwrite': ['playwrite-cc-dk-uloopet', 'cursive'],
        sans: ['var(--font-freight-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#1f2937',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#1f2937',
            },
            strong: {
              color: '#1f2937',
            },
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config