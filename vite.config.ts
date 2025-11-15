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
        // Keeping API key definitions clean
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // Note: Removed 'path' import and usage for simpler path resolution
      resolve: {
        // Alias simplified to relative path
        alias: {
          '@': './',
        }
      },

      // --- CRITICAL BUILD FIX: DIRECT RELATIVE ENTRY PATH ---
      build: {
        rollupOptions: {
          input: {
            // FIX: Using simple string path 'src/index.tsx' to bypass container environment pathing issues.
            main: 'src/index.tsx', 
          },
        },
      }
      // ---------------------------------------------------
    };
});