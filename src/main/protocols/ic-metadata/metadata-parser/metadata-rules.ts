import { AnyNode, Cheerio, CheerioAPI } from 'cheerio';

export type MetadataRule = [
  string,
  (elem: Cheerio<AnyNode>) => string | null | undefined,
];

export type MetadataRules = MetadataRule[];

export function applyMetadataRules(
  $: CheerioAPI,
  metadataRules: MetadataRules,
): string | null {
  for (const [selector, extractor] of metadataRules) {
    const value = extractor($(selector))?.trim();

    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }

  return null;
}

export function processImageUrl(
  imageUrl: string | null,
  canisterId: string,
): string | null {
  if (imageUrl === null) {
    return null;
  }

  try {
    const base = `https://${canisterId}.ic0.app`;

    return new URL(imageUrl, base)?.pathname ?? null;
  } catch {
    return null;
  }
}
