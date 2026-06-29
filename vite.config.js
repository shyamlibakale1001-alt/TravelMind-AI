import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const backend = JSON.parse(readFileSync('./backend.json', 'utf-8'));

export default defineConfig({
  server: {
    allowedHosts: ['barista-sliced-outwit.ngrok-free.dev'],
    proxy: {
      [backend.api.proxyPrefix]: {
        target: backend.api.localBaseUrl || backend.api.baseUrl,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(new RegExp(`^${backend.api.proxyPrefix}`), ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        }
      }
    }
  }
});
