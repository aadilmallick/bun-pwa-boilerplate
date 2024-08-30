/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="webworker" />

import { CacheStrategist } from "./backend/CacheStorageModel";

const sw = self as unknown as ServiceWorkerGlobalScope;

const APP_SHELL = ["/", "/styles.css", "/frontend/index.js"];
const APP_CACHE_NAME = "app-v1";

// Implement app shell caching
sw.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(CacheStrategist.cacheAppShell(APP_CACHE_NAME, APP_SHELL));
});

// Update service worker
sw.addEventListener("activate", (event) => {
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener("fetch", (event) => {
  // these are invalid protocols for service workers
  if (
    event.request.url.startsWith("chrome") ||
    event.request.url.startsWith("chrome-extension")
  ) {
    return;
  }
  event.respondWith(
    CacheStrategist.staleWhileRevalidate(event.request, APP_CACHE_NAME)
  );
});
