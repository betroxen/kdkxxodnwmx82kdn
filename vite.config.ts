import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // Alias block remains minimal
      resolve: {
        alias: {
          '@': './',
        }
      },

      // --- FINAL CRITICAL BUILD FIX: EXPLICIT RELATIVE PATH ---
      build: {
        rollupOptions: {
          input: {
            // FIX: Using explicit relative path './src/index.tsx' 
            main: './src/index.tsx', 
          },
        },
      }
    };
});