import { CustomScheme, protocol } from 'electron';
import { icRequestHandler } from './ic-request-handler';

export const icProtocolScheme: CustomScheme = {
  scheme: 'https',
  privileges: {
    secure: true,
    standard: true,
  },
};

export function registerIcProtocol(): void {
  protocol.interceptBufferProtocol('https', async (request, respond) => {
    const response = await icRequestHandler(request);

    return respond(response);
  });
}
