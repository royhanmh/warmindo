import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{ts,tsx,js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#D71920',
                    foreground: '#FFFFFF',
                    50: '#FEF2F2',
                    100: '#FDE6E6',
                    200: '#FABCBC',
                    300: '#F78C8C',
                    400: '#E84C4C',
                    500: '#D71920',
                    600: '#B3141A',
                    700: '#8E1015',
                    800: '#6A0C10',
                    900: '#46080A',
                },
                accent: {
                    DEFAULT: '#FFD100',
                    foreground: '#1A1A1A',
                    50: '#FFFCE5',
                    100: '#FFF8CC',
                    200: '#FFEF80',
                    300: '#FFE533',
                    400: '#FFD100',
                    500: '#E6BC00',
                    600: '#B39200',
                    700: '#806800',
                },
                success: {
                    DEFAULT: '#008000',
                    foreground: '#FFFFFF',
                    50: '#E6F5E6',
                    100: '#B3E0B3',
                    200: '#66C266',
                    300: '#339933',
                    400: '#008000',
                    500: '#006600',
                    600: '#004D00',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                destructive: {
                    DEFAULT: '#D71920',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
            },
            borderRadius: {
                lg: '12px',
                md: '10px',
                sm: '8px',
                xl: '16px',
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
                heading: ['Montserrat', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'cart-bounce': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'cart-bounce': 'cart-bounce 0.3s ease-in-out',
            },
        },
    },
    plugins: [tailwindcssAnimate],
}

export default config
