import { Principal } from '@dfinity/principal';
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
): Promise<EnrichedMetadata | null> {
  const cacheEntry = await getMetadataCacheEntry(canisterId);

  if (cacheEntry) {
    return cacheEntry;
  }

  const principal = Principal.fromText(canisterId);
  const response = await makeIcHttpRequest(principal, {
    ...request,
    url: '/',
  });

  const responseBody = getResponseBody(response);
  if (!responseBody) {
    return null;
  }

  const $ = cheerio.load(responseBody);

  const metadata = parseMetadata($, canisterId);
  const enrichedMetadata = await enrichMetadata(request, principal, metadata);

  await insertMetadataCacheEntry(canisterId, enrichedMetadata);

  return enrichedMetadata;
}
