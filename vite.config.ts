import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

const apiLocation = process.env.API_LOCATION || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': apiLocation,
    },
  },
  preview: {
    host: true, // Expose on network
    port: 8080, // Optional: set preview port
    allowedHosts: ['skribble.alexcomeau.com'],
  },
});
