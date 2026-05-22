import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { conditions: ['source'] },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    watch: false,
  },
});
