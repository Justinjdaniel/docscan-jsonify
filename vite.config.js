import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/docscan-jsonify/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/scribe.js-ocr/lib',
          dest: 'lib',
        },
        {
          src: 'node_modules/scribe.js-ocr/fonts',
          dest: 'fonts',
        },
      ],
    }),
  ],
});
