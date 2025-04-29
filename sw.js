// **Updated Template - 2025**

const staticCacheName = 'MobilevisitPWAN4_pwa_cache-v-01.20';
const dynamicCacheName = 'MobilevisitPWAN4_pwa_dynamic_cache-v-01.20';
const dynamicCacheSize = 10;
const offlineFilename = 'offline.html';
const showDebugInfo = true;
const usingFirestore = false;
const usingOneSignalPush = false;

// Detect base path dynamically
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');

// Static files to precache
const filesToCache = [
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/offline.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-72.png`,
  `${BASE_PATH}/icons/icon-96.png`,
  `${BASE_PATH}/icons/icon-120.png`,
  `${BASE_PATH}/icons/icon-128.png`,
  `${BASE_PATH}/icons/icon-144.png`,
  `${BASE_PATH}/icons/icon-152.png`,
  `${BASE_PATH}/icons/icon-180.png`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-384.png`,
  `${BASE_PATH}/icons/icon-512.png`,
  // Add here any additional app-specific assets you want cached
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install event
self.addEventListener('install', event => {
  if (showDebugInfo) console.log('** Service Worker installed.');
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      if (showDebugInfo) console.log('** Caching all assets.');
      return cache.addAll(filesToCache);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  if (showDebugInfo) console.log('** Service Worker activated.');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  if (showDebugInfo) console.log('** Fetch event', event.request.url);

  const ignoreRequests = ['chrome-extension', 'firestore.googleapis.com', 'onesignal.com', 'sdks', 'apis'];
  
  const isValidRequest = ignoreRequests.every(domain => !event.request.url.includes(domain));

  if (isValidRequest) {
    event.respondWith(
      caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, dynamicCacheSize);
            return fetchRes;
          });
        });
      }).catch(() => {
        // Fallback only for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE_PATH}/offline.html`);
        }
      })
    );
  }
});
