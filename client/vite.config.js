import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // optional: include .js files explicitly
      // jsxInclude: ['src/**/*.{js,jsx,ts,tsx}']
    }),
  ],
  
});
