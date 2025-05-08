import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/app/pages'),
      "@singletons": path.resolve(__dirname, 'src/singletons'),
      "@env": path.resolve(__dirname, "env.ts"),
      "@components": path.resolve(__dirname,"src/app/components"),
      "@router": path.resolve(__dirname, 'src/app/router'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@textures': path.resolve(__dirname, 'src/assets/textures'),
      '@sounds': path.resolve(__dirname, 'src/assets/sounds'),
      "@types" : path.resolve(__dirname, 'src/types'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});