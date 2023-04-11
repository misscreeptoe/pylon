import { TimedCacheManager } from '../../cache/timed-cache-manager';
import { EnrichedMetadata } from './enrich-metadata';

const IC_METADATA_CACHE_TTL = 10 * 60 * 60 * 1_000; // hours * minutes per hour * seconds per minute * milliseconds per second

interface CachedMetadata extends Omit<EnrichedMetadata, 'icon'> {
  icon: string;
}

let cacheManager: TimedCacheManager<CachedMetadata> | null = null;
let cacheManagerPromise: Promise<TimedCacheManager<CachedMetadata>> | null =
  null;

async function getCacheManager(): Promise<TimedCacheManager<CachedMetadata>> {
  if (cacheManager) {
    return cacheManager;
  }

  if (cacheManagerPromise) {
    return await cacheManagerPromise;
  }

  cacheManagerPromise = TimedCacheManager.create('ic-metadata', 1);
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

export async function upsertMetadataCacheEntry(
  canisterId: string,
  metadata: EnrichedMetadata,
): Promise<void> {
  const cache = await getCacheManager();

  const currentTimestamp = Date.now();
  const expiry = currentTimestamp + IC_METADATA_CACHE_TTL;

  await cache.upsert(canisterId, expiry, {
    ...metadata,
    icon: metadata.icon?.toString('base64') ?? '',
  });
}
