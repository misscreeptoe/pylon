import { CheerioAPI } from 'cheerio';
import { parseDescription } from './parse-description';
import { parseIcon } from './parse-icon';
import { parseImage } from './parse-image';
import { parseTitle } from './parse-title';

export interface Metadata {
  title: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
}

export function parseMetadata($: CheerioAPI, canisterId: string): Metadata {
  return {
    title: parseTitle($),
    description: parseDescription($),
    icon: parseIcon($, canisterId),
    image: parseImage($, canisterId),
  };
}
