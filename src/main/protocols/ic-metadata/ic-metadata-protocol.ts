import { CustomScheme, protocol } from 'electron';
import { icMetadataRequestHandler } from './ic-metadata-request-handler';

export const icMetadataProtocolSchema: CustomScheme = {
  scheme: 'ic-metadata',
  privileges: {
    supportFetchAPI: true,
  },
};

export function registerIcMetadataProtocol(): void {
  protocol.registerBufferProtocol('ic-metadata', async (request, respond) => {
    const response = await icMetadataRequestHandler(request);

    return respond(response);
  });
}
