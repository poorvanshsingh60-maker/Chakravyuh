import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/generate-schedule': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/schedules': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/candidates': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/interviewers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/jobs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/rooms': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/evaluations': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/messages': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
