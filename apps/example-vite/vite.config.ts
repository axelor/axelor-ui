import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin({ svgrOptions: { icon: true } })],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  resolve: {
    alias: [
      {
        find: /^~(.*)/,
        replacement: '$1',
      },
    ],
  },
});
