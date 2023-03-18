import { CheerioAPI } from 'cheerio';
import {
  applyMetadataRules,
  MetadataRules,
  processImageUrl,
} from './metadata-rules';

const imageRules: MetadataRules = [
  ['meta[property="og:image"]', (elem) => elem.attr('content')],
  ['meta[property="og:image:url"]', (elem) => elem.attr('content')],
  ['meta[property="og:image:secure_url"]', (elem) => elem.attr('content')],
  ['meta[property="twitter:image"]', (elem) => elem.attr('content')],
  ['meta[name="twitter:image"]', (elem) => elem.attr('content')],
  ['meta[name="thumbnail"]', (elem) => elem.attr('content')],
];

export function parseImage($: CheerioAPI, canisterId: string): string | null {
  const imageUrl = applyMetadataRules($, imageRules);

  return processImageUrl(imageUrl, canisterId);
}
