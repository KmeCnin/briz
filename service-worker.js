// Nom du cache
const CACHE_NAME = 'briz-cache-v1';

// Fichiers à mettre en cache lors de l'installation
// On met en cache les ressources de base pour que l'app se lance hors ligne.
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap'
];

// Étape 1: Installation du Service Worker
self.addEventListener('install', event => {
  // waitUntil attend que le cache soit rempli avant de terminer l'installation.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Étape 2: Interception des requêtes réseau (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    // On cherche d'abord la ressource dans le cache.
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la retourne.
        if (response) {
          return response;
        }
        // Sinon, on fait une requête réseau classique.
        return fetch(event.request);
      }
    )
  );
});

// Étape 3: Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // On garde uniquement le cache actuel.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // On supprime les anciens caches pour libérer de l'espace.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
