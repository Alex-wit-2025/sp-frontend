/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'background': 'var(--background)',
        'primary': 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'accent': 'var(--accent)',
        'accent-light': 'var(--accent-light)',
      },
      colors: {
        'primary': 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'accent': 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'background': 'var(--background)',
        'error': 'var(--error)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
      }
    },
  },
  plugins: [],
};