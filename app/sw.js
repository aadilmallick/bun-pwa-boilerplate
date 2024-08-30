// backend/CacheStorageModel.ts
class CacheStorageModel {
  cacheName;
  cache = null;
  constructor(cacheName) {
    this.cacheName = cacheName;
  }
  async openCache() {
    const cache = await caches.open(this.cacheName);
    return cache;
  }
  async addAll(requests) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    await this.cache.addAll(requests);
  }
  async match(request) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.match(request);
  }
  async matchAll(request) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.matchAll(request);
  }
  async add(request) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.add(request);
  }
  async delete(request) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.delete(request);
  }
  async keys(request) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.keys(request);
  }
  async put(request, response) {
    if (!this.cache) {
      this.cache = await this.openCache();
    }
    return this.cache.put(request, response);
  }
}

class CacheStrategist {
  static async cacheAppShell(cacheName, appShell) {
    const appShellStorage = new CacheStorageModel(cacheName);
    await appShellStorage.addAll(appShell);
  }
  static async cacheFirst(request, cacheName) {
    const cacheStorage = new CacheStorageModel(cacheName);
    const cacheResponse = await cacheStorage.match(request);
    if (cacheResponse) {
      return cacheResponse;
    } else {
      const response = await fetch(request);
      await cacheStorage.put(request, response.clone());
      return response;
    }
  }
  static async staleWhileRevalidate(request, cacheName) {
    const cacheStorage = new CacheStorageModel(cacheName);
    const cacheResponse = await cacheStorage.match(request);
    if (cacheResponse) {
      try {
        fetch(request).then((response) => {
          cacheStorage.put(request, response.clone());
        });
      } catch (e) {
      } finally {
        return cacheResponse;
      }
    } else {
      const response = await fetch(request);
      await cacheStorage.put(request, response.clone());
      return response;
    }
  }
}

// sw.ts
var sw = self;
var APP_SHELL = [];
var APP_CACHE_NAME = "app-v1";
sw.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(CacheStrategist.cacheAppShell(APP_CACHE_NAME, APP_SHELL));
});
sw.addEventListener("activate", (event) => {
  event.waitUntil(sw.clients.claim());
});
sw.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("chrome") || event.request.url.startsWith("chrome-extension")) {
    return;
  }
  event.respondWith(CacheStrategist.staleWhileRevalidate(event.request, APP_CACHE_NAME));
});
