import { protocol } from 'electron';
import { Readable } from 'stream';

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

// [TODO] - implement redirect to ICP protocol logic
export function shouldRedirectToIcpProtocol(_url: string): boolean {
  return false;
}

export function getIcpProtocolRedirectUrl(url: string): string {
  return url.replace(/^https?:\/\//, 'icp:');
}

export function registerIcpProtocol(): void {
  protocol.registerStreamProtocol('icp', async (protocolRequest, respond) => {
    // [TODO] - fetch requested asset

    // [TODO] - certify asset

    return respond({
      statusCode: 404,
      headers: { 'Content-Type': 'text/html' },
      data: intoStream(`<h1>File not found</h1>`),
    });
  });
}

function intoStream(text: string) {
  return new Readable({
    read() {
      this.push(text);
      this.push(null);
    },
  });
}
