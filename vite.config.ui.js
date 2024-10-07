import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: './ui-src',
  plugins: [viteSingleFile()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 10000000, // Inline all assets (CSS, JS) into the HTML file
    cssCodeSplit: false, // Do not split CSS into a separate file
    outDir: '../dist', // Output directory for the build
  },
});
