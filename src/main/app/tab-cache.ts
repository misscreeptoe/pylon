import { CacheManager } from '../cache';

interface CachedTab {
  url: string;
}

let cacheManager: CacheManager<CachedTab> | null = null;
let cacheManagerPromise: Promise<CacheManager<CachedTab>> | null = null;

async function getCacheManager(): Promise<CacheManager<CachedTab>> {
  if (cacheManager) {
    return cacheManager;
  }

  if (cacheManagerPromise) {
    return await cacheManagerPromise;
  }

  cacheManagerPromise = CacheManager.create('tabs', 1);
  cacheManager = await cacheManagerPromise;

  return cacheManager;
}

export async function getTabCacheEntry(id: string): Promise<CachedTab | null> {
  const cache = await getCacheManager();

  return cache.get(id);
}

export async function upsertTabCacheEntry(
  id: string,
  url: string,
): Promise<void> {
  const cache = await getCacheManager();

  await cache.upsert(id, {
    url,
  });
}

export async function removeTabCacheEntry(id: string): Promise<void> {
  const cache = await getCacheManager();

  await cache.remove(id);
}
