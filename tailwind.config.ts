import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'screen-shake': {
					'0%': { transform: 'translate(0, 0) rotate(0deg)' },
					'10%': { transform: 'translate(-2px, -1px) rotate(-0.5deg)' },
					'20%': { transform: 'translate(-1px, 2px) rotate(0.5deg)' },
					'30%': { transform: 'translate(2px, 0px) rotate(0deg)' },
					'40%': { transform: 'translate(0px, -1px) rotate(0.5deg)' },
					'50%': { transform: 'translate(-1px, 1px) rotate(-0.5deg)' },
					'60%': { transform: 'translate(1px, 0px) rotate(0deg)' },
					'70%': { transform: 'translate(0px, 1px) rotate(-0.5deg)' },
					'80%': { transform: 'translate(-1px, -1px) rotate(0.5deg)' },
					'90%': { transform: 'translate(1px, -1px) rotate(0deg)' },
					'100%': { transform: 'translate(0, 0) rotate(0deg)' }
				},
				'rocket-explode': {
					'0%': { 
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'25%': {
						transform: 'scale(1.2) rotate(5deg)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'scale(1.5) rotate(-5deg)',
						opacity: '0.6'
					},
					'75%': {
						transform: 'scale(2) rotate(10deg)',
						opacity: '0.3'
					},
					'100%': {
						transform: 'scale(3) rotate(-10deg)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'screen-shake': 'screen-shake 0.5s ease-in-out',
				'rocket-explode': 'rocket-explode 0.8s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
