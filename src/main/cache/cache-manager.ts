import { app } from 'electron';
import { writeFile, readFile, mkdir } from 'node:fs/promises';

interface Cache<T> {
  version: number;
  entries: {
    [key: string]: {
      expiry: number;
      data: T;
    };
  };
}

export class CacheManager<T> {
  private cache: Cache<T> | null = null;
  private readonly cacheDir: string;
  private readonly cacheFile: string;

  private constructor(cacheName: string, private readonly version: number) {
    this.cacheDir = `${app.getPath('userData')}/cache`;
    this.cacheFile = `${this.cacheDir}/${cacheName}.json`;
  }

  public static async create<T>(
    cacheName: string,
    version: number,
  ): Promise<CacheManager<T>> {
    const cacheManager = new CacheManager<T>(cacheName, version);

    await cacheManager.init();

    return cacheManager;
  }

  public async insert(key: string, expiry: number, data: T): Promise<void> {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    this.cache.entries[key] = {
      expiry,
      data,
    };

    await this.writeCacheToFile();
  }

  public get(key: string): T | null {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    const currentTimestamp = Date.now();
    const entry = this.cache.entries[key];

    // if the cache entry is missing
    if (!entry) {
      return null;
    }

    // if any of the cache entry's properties are missing (it is corrupt),
    // or the expiry date is in the past
    if (!entry.expiry || !entry.data || entry.expiry < currentTimestamp) {
      this.remove(key);
      return null;
    }

    return entry.data;
  }

  public async remove(key: string): Promise<void> {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    delete this.cache.entries[key];

    await this.writeCacheToFile();
  }

  private async init(): Promise<void> {
    try {
      await this.hydrateCache();
    } catch {
      await this.initCache();
    }
  }

  private async hydrateCache(): Promise<void> {
    const cacheJson = await readFile(this.cacheFile, { encoding: 'utf-8' });

    this.cache = JSON.parse(cacheJson);
  }

  private async initCache(): Promise<void> {
    this.cache = {
      version: this.version,
      entries: {},
    };

    await mkdir(this.cacheDir, { recursive: true });
    await this.writeCacheToFile();
  }

  private async writeCacheToFile(): Promise<void> {
    const cacheJson = JSON.stringify(this.cache);

    await writeFile(this.cacheFile, cacheJson, { encoding: 'utf-8' });
  }
}
