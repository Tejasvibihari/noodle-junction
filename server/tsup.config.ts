import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  sourcemap: true,
  clean: true,
  // @nj/shared ships TypeScript source (no build step), so bundle it in.
  noExternal: ['@nj/shared'],
});
