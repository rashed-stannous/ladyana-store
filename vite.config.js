import { defineConfig } from 'vite';

// Use the automatic JSX runtime for all TSX/JSX modules.
// This prevents browser crashes caused by compiled JSX referring to a
// missing global React variable (particularly visible in Safari).
export default defineConfig({
  server: { allowedHosts: ['terminal.local'] },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
