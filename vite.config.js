import { defineConfig } from 'vite';

// Use the automatic JSX runtime for all TSX/JSX modules.
// This prevents browser crashes caused by compiled JSX referring to a
// missing global React variable (particularly visible in Safari).
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
