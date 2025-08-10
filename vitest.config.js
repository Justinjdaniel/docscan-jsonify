import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    deps: {
      // Explicitly inline Chakra UI packages to ensure they are processed correctly by Vite
      // This is necessary to resolve module format issues in the test environment.
      inline: [
        '@chakra-ui/react',
        '@chakra-ui/system',
        '@chakra-ui/theme',
        '@chakra-ui/theme-utils',
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
