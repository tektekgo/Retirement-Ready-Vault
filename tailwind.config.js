/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929', // Deep navy base
        },
        
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd5cc',
          300: '#ffb8a8',
          400: '#ff9073',
          500: '#ff6b47', // Primary coral
          600: '#f04e2a',
          700: '#d63f1f',
          800: '#b3341d',
          900: '#942f1e',
        },
        
        charcoal: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1d20', // Charcoal base
        },
      },
      
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'input': '0 0 0 3px rgba(20, 184, 166, 0.1)',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      backgroundImage: {
        'gradient-teal': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        'gradient-coral': 'linear-gradient(135deg, #ff6b47 0%, #f04e2a 100%)',
        'gradient-navy': 'linear-gradient(135deg, #243b53 0%, #102a43 100%)',
        'gradient-duotone': 'linear-gradient(135deg, #14b8a6 0%, #ff6b47 100%)',
      },
    },
  },
  plugins: [],
}
