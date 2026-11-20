import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// three.js / R3F live only in the lazily imported SceneCanvas chunk,
// so text and navigation render before any 3D code is downloaded.
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1200 },
});
