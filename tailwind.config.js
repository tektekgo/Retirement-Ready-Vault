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
        // Primary: Deep Green - for primary surfaces and buttons
        primary: {
          50: '#e8f2f0',
          100: '#d1e5e1',
          200: '#a3cbc3',
          300: '#75b1a5',
          400: '#479787',
          500: '#0F3A32', // Main primary color
          600: '#0c2e28',
          700: '#09231e',
          800: '#061714',
          900: '#030c0a',
        },

        // Secondary: Warm Stone - for secondary surfaces
        secondary: {
          50: '#f5f3f1',
          100: '#ebe7e3',
          200: '#d7cfc7',
          300: '#c3b7ab',
          400: '#af9f8f',
          500: '#A59686', // Main secondary color
          600: '#84786b',
          700: '#635a50',
          800: '#423c35',
          900: '#211e1b',
        },

        // Accent: Copper Orange - for accents and focus rings
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F97316', // Main accent color
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        // Background: Warm Off-white
        background: {
          DEFAULT: '#FDF7EC',
          50: '#fefdfb',
          100: '#fdf7ec',
        },

        // Foreground: Almost Black - for text
        foreground: {
          DEFAULT: '#171C1B',
          50: '#f3f4f4',
          100: '#e7e9e8',
          200: '#cfd3d1',
          300: '#b7bdba',
          400: '#9fa7a3',
          500: '#87918c',
          600: '#6f7b75',
          700: '#57655e',
          800: '#3f4f47',
          900: '#171C1B', // Main foreground color
        },

        // Muted: Soft Sage - for muted sections
        muted: {
          50: '#E6F2EC',
          100: '#dceee3',
          200: '#b9ddc7',
          300: '#96ccab',
          400: '#73bb8f',
          500: '#50aa73',
          600: '#3d8257',
          700: '#2a5a3b',
          800: '#17321f',
          900: '#040a03',
        },

        // Keep coral for error states
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd5cc',
          300: '#ffb8a8',
          400: '#ff9073',
          500: '#ff6b47',
          600: '#f04e2a',
          700: '#d63f1f',
          800: '#b3341d',
          900: '#942f1e',
        },

        // Maintain backward compatibility with existing color names
        charcoal: {
          50: '#f3f4f4',
          100: '#e7e9e8',
          200: '#cfd3d1',
          300: '#b7bdba',
          400: '#9fa7a3',
          500: '#87918c',
          600: '#171C1B', // Map to foreground
          700: '#171C1B',
          800: '#171C1B',
          900: '#171C1B',
        },

        // Keep for backward compatibility but map to new colors
        teal: {
          50: '#e8f2f0',
          100: '#d1e5e1',
          200: '#a3cbc3',
          300: '#75b1a5',
          400: '#479787',
          500: '#0F3A32', // Map to primary
          600: '#0c2e28',
          700: '#09231e',
          800: '#061714',
          900: '#030c0a',
        },

        slate: {
          50: '#fefdfb',
          100: '#fdf7ec',
          200: '#f5f3f1',
          300: '#ebe7e3',
          400: '#d7cfc7',
          500: '#A59686', // Map to secondary
          600: '#171C1B', // Map to foreground
          700: '#171C1B',
          800: '#171C1B',
          900: '#171C1B',
        },

        cream: {
          50: '#FDF7EC', // Map to background
          100: '#fdf7ec',
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
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.12)',
        'input': '0 0 0 3px rgba(249, 115, 22, 0.1)', // Accent orange focus ring
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0F3A32 0%, #A59686 100%)', // Primary to Secondary
        'gradient-subtle': 'linear-gradient(135deg, #FDF7EC 0%, #E6F2EC 50%, #FDF7EC 100%)', // Background with muted tint
        'gradient-warm': 'linear-gradient(135deg, #FDF7EC 0%, #E6F2EC 100%)', // Background to muted
        'gradient-accent': 'linear-gradient(135deg, #F97316 0%, #ea580c 100%)', // Accent gradient
      },
    },
  },
  plugins: [],
}
