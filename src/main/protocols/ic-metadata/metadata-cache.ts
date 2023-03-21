import { Principal } from '@dfinity/principal';
import { CacheManager } from '../../cache';
import { EnrichedMetadata } from './enrich-metadata';

const IC_METADATA_CACHE_TTL = 10 * 60 * 60 * 1_000; // hours * minutes per hour * seconds per minute * milliseconds per second

interface CachedMetadata extends Omit<EnrichedMetadata, 'icon'> {
  icon: string;
}

let cacheManager: CacheManager<CachedMetadata> | null = null;
let cacheManagerPromise: Promise<CacheManager<CachedMetadata>> | null = null;

async function getCacheManager(): Promise<CacheManager<CachedMetadata>> {
  if (cacheManager) {
    return cacheManager;
  }

  if (cacheManagerPromise) {
    return await cacheManagerPromise;
  }

  cacheManagerPromise = CacheManager.create('ic-metadata', 1);

  cacheManager = await cacheManagerPromise;
  return cacheManager;
}

export async function getMetadataCacheEntry(
  canisterId: string,
): Promise<EnrichedMetadata | null> {
  const cache = await getCacheManager();

  const cacheEntry = cache.get(canisterId);

  if (!cacheEntry) {
    return null;
  }

  return {
    ...cacheEntry,
    icon: Buffer.from(cacheEntry.icon, 'base64'),
  };
}

export async function insertMetadataCacheEntry(
  canisterId: string,
  metadata: EnrichedMetadata,
) {
  const cache = await getCacheManager();

  const currentTimestamp = Date.now();
  const expiry = currentTimestamp + IC_METADATA_CACHE_TTL;

  await cache.insert(canisterId, expiry, {
    ...metadata,
    icon: metadata.icon.toString('base64'),
  });
}
