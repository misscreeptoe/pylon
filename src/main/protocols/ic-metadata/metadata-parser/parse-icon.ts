import { CheerioAPI } from 'cheerio';
import {
  applyMetadataRules,
  MetadataRules,
  processImageUrl,
} from './metadata-rules';

const iconRules: MetadataRules = [
  ['link[rel="apple-touch-icon"]', (elem) => elem.attr('href')],
  ['link[rel="icon"]', (elem) => elem.attr('href')],
  ['link[rel="shortcut icon"]', (elem) => elem.attr('href')],
  ['link[rel="apple-touch-icon-precomposed"]', (elem) => elem.attr('href')],
  ['link[rel="fluid-icon"]', (elem) => elem.attr('href')],
  ['link[rel="mask-icon"]', (elem) => elem.attr('href')],
];

export function parseIcon($: CheerioAPI, canisterId: string): string {
  const iconUrl = applyMetadataRules($, iconRules);

  return processImageUrl(iconUrl, canisterId) ?? 'favicon.ico';
}
