// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      degular: ['Degular Semibold', 'sans-serif'],
    },
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        primary: {
          25: 'rgb(var(--primary-25) / <alpha-value>)',
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
        secondary: {
          50: 'rgb(var(--secondary-50) / <alpha-value>)',
          600: 'rgb(var(--secondary-600) / <alpha-value>)',
          700: 'rgb(var(--secondary-700) / <alpha-value>)',
        },
        info: 'rgb(var(--info) / <alpha-value>)',
        'info-foreground': 'rgb(var(--info-foreground) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-muted': 'rgb(var(--success-muted) / <alpha-value>)',
        'success-foreground': 'rgb(var(--success-foreground) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        'danger-foreground': 'rgb(var(--danger-foreground) / <alpha-value>)',
        'icon-muted': 'rgb(var(--icon-muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
      },
      outline: {
        blue: '2px solid rgba(0, 112, 244, 0.5)',
      },
      fontFamily: {
        inter: ['rgb(var(--font-inter)', 'sans-serif) / <alpha-value>'],
      },
      fontSize: {
        xs: ['0.75rem', {lineHeight: '1.5'}],
        sm: ['0.875rem', {lineHeight: '1.5715'}],
        base: ['1rem', {lineHeight: '1.5', letterSpacing: '-0.01em'}],
        lg: ['1.125rem', {lineHeight: '1.5', letterSpacing: '-0.01em'}],
        xl: ['1.25rem', {lineHeight: '1.5', letterSpacing: '-0.01em'}],
        '2xl': ['1.5rem', {lineHeight: '1.33', letterSpacing: '-0.01em'}],
        '3xl': ['1.88rem', {lineHeight: '1.33', letterSpacing: '-0.01em'}],
        '4xl': ['2.25rem', {lineHeight: '1.25', letterSpacing: '-0.02em'}],
        '5xl': ['3rem', {lineHeight: '1.25', letterSpacing: '-0.02em'}],
        '6xl': ['3.75rem', {lineHeight: '1.2', letterSpacing: '-0.02em'}],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // add custom variant for expanding sidebar
    plugin(({addVariant, e}) => {
      addVariant('not-last-child', '&:not(:last-child)')
      addVariant('not-last-of-type', '&:not(:last-of-type)')
      addVariant('sidebar-expanded', ({modifySelectors, separator}) => {
        modifySelectors(
          ({className}) => `.sidebar-expanded .${e(`sidebar-expanded${separator}${className}`)}`,
        )
      })
    }),
  ],
}
