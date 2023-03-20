import * as cheerio from 'cheerio';
import { ProtocolRequest } from 'electron';
import { getResponseBody } from '../../electron';
import { makeIcHttpRequest } from '../../http-gateway';
import { EnrichedMetadata, enrichMetadata } from './enrich-metadata';
import {
  getMetadataCacheEntry,
  insertMetadataCacheEntry,
} from './metadata-cache';
import { parseMetadata } from './metadata-parser';

export async function fetchMetadata(
  request: ProtocolRequest,
  canisterId: string,
): Promise<EnrichedMetadata> {
  const cacheEntry = await getMetadataCacheEntry(canisterId);

  if (cacheEntry) {
    return cacheEntry;
  }

  const response = await makeIcHttpRequest(canisterId, {
    ...request,
    url: '/',
  });

  const responseBody = getResponseBody(response);
  const $ = cheerio.load(responseBody);

  const metadata = parseMetadata($, canisterId);
  const enrichedMetadata = await enrichMetadata(request, canisterId, metadata);

  await insertMetadataCacheEntry(canisterId, enrichedMetadata);

  return enrichedMetadata;
}
