import { ProtocolRequest, ProtocolResponse } from 'electron';
import * as cheerio from 'cheerio';
import { makeIcHttpRequest } from '../../http-gateway';
import { tryParseIcMetadataRequestUrl } from './ic-metadata-request-url';
import { parseMetadata } from './metadata-parser';
import { getResponseBody } from '../../electron';

export async function icMetadataRequestHandler(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  const parsedIcMetadataRequestUrl = tryParseIcMetadataRequestUrl(request.url);

  if (!parsedIcMetadataRequestUrl) {
    // [TODO]: Handle error
    return {
      data: '',
    };
  }

  const response = await makeIcHttpRequest(
    parsedIcMetadataRequestUrl.canisterId,
    {
      ...request,
      url: '/',
    },
  );

  const responseBody = getResponseBody(response);
  const $ = cheerio.load(responseBody);

  const metadata = parseMetadata($, parsedIcMetadataRequestUrl.canisterId);
  switch (parsedIcMetadataRequestUrl.method) {
    case 'icon':
      const iconResponse = await makeIcHttpRequest(
        parsedIcMetadataRequestUrl.canisterId,
        {
          ...request,
          url: metadata.icon,
        },
      );

      return iconResponse;

    case 'title':
      return {
        data: Buffer.from(metadata.title),
      };
  }
}
