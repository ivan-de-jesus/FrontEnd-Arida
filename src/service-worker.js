/* src/service-worker.js */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

self.__WB_DISABLE_DEV_LOGS = true;

// Archivos generados por Vue CLI
precacheAndRoute(self.__WB_MANIFEST);

// Cache de tu API Landsat
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/landsat'),
  new NetworkFirst({
    cacheName: 'landsat-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 1 día
      }),
    ],
  }),
);

// Recursos estáticos (css, js, imgs, fuentes)
registerRoute(
  ({ request }) =>
    ['style', 'script', 'image', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);
