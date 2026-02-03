
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/HTMLPro/', // GitHub Pages sirve la app desde /HTMLPro/
});
