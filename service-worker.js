const CACHE='welcome-home-foundation-v01';
const ASSETS=['./','./index.html','./css/base.css','./css/rooms.css','./css/ui.css','./css/animations.css','./app/app.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
