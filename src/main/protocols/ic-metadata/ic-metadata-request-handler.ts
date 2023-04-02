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
        data: metadata?.icon ? Buffer.from(metadata.icon) : '',
      };

    case 'title':
      return {
        data: metadata?.title ? Buffer.from(metadata.title) : '',
      };

    default:
      throw new Error(
        `Requested a metadata type that is not supported: ${parsedIcMetadataRequestUrl.method}`,
      );
  }
}
