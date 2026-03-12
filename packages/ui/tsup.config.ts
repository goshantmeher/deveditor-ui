import { defineConfig } from 'tsup';

/**
 * tsup: TypeScript library bundler (esbuild-based).
 * - Dual output: ESM (dist/index.mjs) + CJS (dist/index.js) for broad compatibility.
 * - Declaration files: .d.ts (CJS) and .d.mts (ESM) for type-safe consumption.
 * - Tree-shakeable: consumers only bundle what they import (see package.json "exports").
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: ['react', 'react-dom'],
});
