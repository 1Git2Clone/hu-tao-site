import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/forms'

const config: Config = {
  darkMode: ['selector', '[class~="dark"]'],
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#333333',
        muted: '#eaeaea',
        tertiary: '#9e9e9e',
      },
    },
  },
  plugins: [
    forms, typography
  ],
};

export default config;
