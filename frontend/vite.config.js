/* 📁 ARQUIVO: frontend/vite.config.js
 * 🧠 RESPONSÁVEL POR: Config do Vite com portas automáticas e proxy /api → backend
 * 🔗 DEPENDÊNCIAS: vite, @vitejs/plugin-react
 */

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const host = env.VITE_HOST || '0.0.0.0';
  const port = Number(env.VITE_PORT || 3100);
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:4100';

  return {
    plugins: [react()],
    server: {
      host,
      port,
      strictPort: false,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
