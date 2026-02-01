import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/HTMLPro/', // Cambia '/HTMLPro/' según tu repositorio
});