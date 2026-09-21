import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://localhost:27017/nj_test',
      REDIS_URL: 'redis://localhost:6379',
      CORS_ORIGINS: 'http://localhost:3000',
      LOG_LEVEL: 'silent',
    },
  },
});
