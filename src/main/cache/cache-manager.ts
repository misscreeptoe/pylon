import { app } from 'electron';
import { writeFile, readFile, mkdir } from 'node:fs/promises';

export interface CacheEntries<T> {
  [key: string]: T;
}

export interface Cache<T> {
  version: number;
  entries: CacheEntries<T>;
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

  public async upsert(key: string, data: T): Promise<void> {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    this.cache.entries[key] = data;

    await this.writeCacheToFile();
  }

  public get(key: string): T | null {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    const entry = this.cache.entries[key];

    // if the cache entry is missing
    if (!entry) {
      return null;
    }

    return entry;
  }

  public getAll(): CacheEntries<T> {
    if (!this.cache) {
      throw new Error('Cache must be initialized before use');
    }

    return this.cache.entries;
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
