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
        // Primary: Deep Plum - for primary surfaces and buttons
        primary: {
          50: '#f5f0f8',
          100: '#ebe1f1',
          200: '#d7c3e3',
          300: '#c3a5d5',
          400: '#af87c7',
          500: '#3A234B', // Main primary color
          600: '#2e1c3c',
          700: '#23152d',
          800: '#170e1e',
          900: '#0c070f',
        },

        // Secondary: Cool Taupe - for secondary surfaces
        secondary: {
          50: '#f7f5f9',
          100: '#efebf3',
          200: '#dfd7e7',
          300: '#cfc3db',
          400: '#bfafcf',
          500: '#A497B2', // Main secondary color
          600: '#83798e',
          700: '#625b6b',
          800: '#423c47',
          900: '#211e24',
        },

        // Accent: Rich Gold - for accents and focus rings
        accent: {
          50: '#fefbf0',
          100: '#fdf7e1',
          200: '#fbefc3',
          300: '#f9e7a5',
          400: '#f7df87',
          500: '#F5B623', // Main accent color
          600: '#c4921c',
          700: '#936e15',
          800: '#624a0e',
          900: '#312507',
        },

        // Background: Ivory
        background: {
          DEFAULT: '#FFFBF2',
          50: '#FFFBF2',
          100: '#fffbf2',
        },

        // Foreground: Ink - for text
        foreground: {
          DEFAULT: '#1A1123',
          50: '#f2f0f4',
          100: '#e5e1e9',
          200: '#cbc3d3',
          300: '#b1a5bd',
          400: '#9787a7',
          500: '#7d6991',
          600: '#634b7b',
          700: '#493765',
          800: '#2f234f',
          900: '#1A1123', // Main foreground color
        },

        // Muted: Lavender Gray - for muted sections
        muted: {
          50: '#F1ECF7',
          100: '#ebe4f3',
          200: '#d7c9e7',
          300: '#c3aedb',
          400: '#af93cf',
          500: '#9b78c3',
          600: '#7c609c',
          700: '#5d4875',
          800: '#3e304e',
          900: '#1f1827',
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
          50: '#f2f0f4',
          100: '#e5e1e9',
          200: '#cbc3d3',
          300: '#b1a5bd',
          400: '#9787a7',
          500: '#7d6991',
          600: '#1A1123', // Map to foreground
          700: '#1A1123',
          800: '#1A1123',
          900: '#1A1123',
        },

        // Keep for backward compatibility but map to new colors
        teal: {
          50: '#f5f0f8',
          100: '#ebe1f1',
          200: '#d7c3e3',
          300: '#c3a5d5',
          400: '#af87c7',
          500: '#3A234B', // Map to primary
          600: '#2e1c3c',
          700: '#23152d',
          800: '#170e1e',
          900: '#0c070f',
        },

        blue: {
          50: '#f5f0f8',
          100: '#ebe1f1',
          200: '#d7c3e3',
          300: '#c3a5d5',
          400: '#af87c7',
          500: '#3A234B', // Map to primary
          600: '#2e1c3c',
          700: '#23152d',
          800: '#170e1e',
          900: '#0c070f',
        },

        slate: {
          50: '#FFFBF2',
          100: '#FFFBF2',
          200: '#f7f5f9',
          300: '#efebf3',
          400: '#dfd7e7',
          500: '#A497B2', // Map to secondary
          600: '#1A1123', // Map to foreground
          700: '#1A1123',
          800: '#1A1123',
          900: '#1A1123',
        },

        navy: {
          50: '#f5f0f8',
          100: '#ebe1f1',
          200: '#d7c3e3',
          300: '#c3a5d5',
          400: '#af87c7',
          500: '#3A234B', // Map to primary
          600: '#2e1c3c',
          700: '#23152d',
          800: '#170e1e',
          900: '#0c070f',
        },

        cream: {
          50: '#FFFBF2', // Map to background
          100: '#FFFBF2',
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
        'card': '0 2px 8px rgba(26, 17, 35, 0.08)',
        'card-hover': '0 8px 24px rgba(26, 17, 35, 0.15)',
        'button': '0 2px 4px rgba(26, 17, 35, 0.12)',
        'input': '0 0 0 3px rgba(245, 182, 35, 0.15)', // Accent gold focus ring
        'glow': '0 0 20px rgba(245, 182, 35, 0.3)',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      backgroundImage: {
        'gradient-primary': 'radial-gradient(ellipse at top, #3A234B 0%, #2e1c3c 50%, #1A1123 100%)',
        'gradient-subtle': 'radial-gradient(ellipse at center, #FFFBF2 0%, #F1ECF7 50%, #FFFBF2 100%)',
        'gradient-warm': 'radial-gradient(circle at top right, #F1ECF7 0%, #FFFBF2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F5B623 0%, #c4921c 100%)',
        'gradient-hero': 'radial-gradient(ellipse at bottom, #3A234B 0%, #1A1123 100%)',
      },
    },
  },
  plugins: [],
}
