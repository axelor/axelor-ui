import * as path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), svgr()],
  resolve: {
    alias: {
      '@axelor-ui/core': path.resolve(__dirname, '../core/src'),
    },
  },
});
