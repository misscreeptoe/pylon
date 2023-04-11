import { CacheEntries, CacheManager } from './cache-manager';

export interface TimedCacheEntry<T> {
  expiry: number;
  data: T;
}

export class TimedCacheManager<T> {
  private constructor(
    private readonly cacheManager: CacheManager<TimedCacheEntry<T>>,
  ) {}

  public static async create<T>(
    cacheName: string,
    version: number,
  ): Promise<TimedCacheManager<T>> {
    const cacheManager = await CacheManager.create<TimedCacheEntry<T>>(
      cacheName,
      version,
    );

    return new TimedCacheManager<T>(cacheManager);
  }

  public async upsert(key: string, expiry: number, data: T): Promise<void> {
    await this.cacheManager.upsert(key, {
      expiry,
      data,
    });
  }

  public get(key: string): T | null {
    const entry = this.cacheManager.get(key);

    // if the cache entry is missing
    if (!entry) {
      return null;
    }

    const currentTimestamp = Date.now();

    // if any of the cache entry's properties are missing (it is corrupt),
    // or the expiry date is in the past
    if (!entry.expiry || !entry.data || entry.expiry < currentTimestamp) {
      this.cacheManager.remove(key);
      return null;
    }

    return entry.data;
  }

  public getAll(): CacheEntries<T> {
    const cacheEntries = this.cacheManager.getAll();

    return Object.entries(cacheEntries).reduce<CacheEntries<T>>(
      (accum, [id, entry]) => ({
        ...accum,
        [id]: entry.data,
      }),
      {},
    );
  }

  public async remove(key: string): Promise<void> {
    return await this.cacheManager.remove(key);
  }
}
