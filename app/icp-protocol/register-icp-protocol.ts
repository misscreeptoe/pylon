import { protocol } from 'electron';
import { icpRequestHandler } from './icp-request-handler';

export const icpProtocolScheme: Electron.CustomScheme = {
  scheme: 'icp',
  privileges: {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true,
    corsEnabled: true,
    stream: true,
    bypassCSP: true,
  },
};

export function registerIcpProtocol(): void {
  protocol.registerBufferProtocol('icp', async (request, respond) => {
    const response = await icpRequestHandler(request);

    return respond(response);
  });
}
