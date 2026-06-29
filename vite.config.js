import { defineConfig } from 'vite';

const N8N_NGROK_TARGET = 'https://barista-sliced-outwit.ngrok-free.dev';

export default defineConfig({
  server: {
    proxy: {
      '/api/n8n': {
        target: N8N_NGROK_TARGET,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        }
      }
    }
  }
});
