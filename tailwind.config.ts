import type { Config } from 'tailwindcss';

const config: Config = {
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
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
