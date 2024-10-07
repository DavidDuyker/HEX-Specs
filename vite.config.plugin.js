import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname, // Set the root to plugin-src
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: 'plugin-src/code.js', // Entry point for the TypeScript code
      output: {
        entryFileNames: 'code.js', // Output file name for the code
      },
    },
  },
});
