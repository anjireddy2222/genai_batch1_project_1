/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        primary: 'var(--primary)',
        'primary-contrast': 'var(--primary-contrast)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        control: '8px',
        card: '12px',
      },
    },
  },
  plugins: [],
}
