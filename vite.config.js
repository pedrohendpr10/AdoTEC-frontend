import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O backend AdoTEC libera CORS para http://localhost:5173 (porta padrão do Vite).
// Mantenha esta porta para que as requisições autenticadas funcionem em dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
