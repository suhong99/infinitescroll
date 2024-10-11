import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8', // or 'v8'
      exclude: [
        'src/const/**',
        'src/components/Header.tsx',
        'src/components/Spinner.tsx',
        'src/main.tsx',
        '**/*.test.tsx',
        '**/*.test.ts',
        'src/vite-env.d.ts',
        'src/test/**',
      ],
      include: ['src/**/*.tsx', 'src/**/*.ts'],
    },
  },
});
