importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
