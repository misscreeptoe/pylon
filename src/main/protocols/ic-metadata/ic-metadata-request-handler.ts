import { ProtocolRequest, ProtocolResponse } from 'electron';
import { tryParseIcMetadataRequestUrl } from './ic-metadata-request-url';
import { fetchMetadata } from './fetch-metadata';

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

  const metadata = await fetchMetadata(
    request,
    parsedIcMetadataRequestUrl.canisterId,
  );

  switch (parsedIcMetadataRequestUrl.method) {
    case 'icon':
      return {
        data: Buffer.from(metadata.icon),
      };

    case 'title':
      return {
        data: Buffer.from(metadata.title),
      };
  }
}
