import { CheerioAPI } from 'cheerio';
import { applyMetadataRules, MetadataRules } from './metadata-rules';

const descriptionRules: MetadataRules = [
  ['meta[name="description"]', elem => elem.attr('content')],
  ['meta[property="og:description"]', elem => elem.attr('content')],
  ['meta[property="twitter:description"]', elem => elem.attr('content')],
];

export function parseDescription($: CheerioAPI): string | null {
  return applyMetadataRules($, descriptionRules);
}
