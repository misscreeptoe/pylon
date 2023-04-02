import { CheerioAPI } from 'cheerio';
import { applyMetadataRules, MetadataRules } from './metadata-rules';

const titleRules: MetadataRules = [
  ['meta[name="title"]', elem => elem.attr('content')],
  ['title', elem => elem.text()],
  ['meta[property="og:title"]', elem => elem.attr('content')],
  ['meta[name="twitter:title"]', elem => elem.attr('content')],
  ['meta[property="twitter:title"]', elem => elem.attr('content')],
  ['meta[name="hdl"]', elem => elem.attr('content')],
];

export function parseTitle($: CheerioAPI): string | null {
  return applyMetadataRules($, titleRules);
}
