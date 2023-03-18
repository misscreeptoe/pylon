import { Principal } from '@dfinity/principal';
import { protocol } from 'electron';
import { Readable } from 'stream';
import { createCanisterActor } from './agent';

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

export interface IcpProtocolUrl {
  canisterId: string;
  path: string;
}

export function parseIcpProtocolUrl(url: string): IcpProtocolUrl {
  let urlWithoutProtocol = url.replace(/^icp:\/?\/?/, '');
  let [canisterId, ...rest] = urlWithoutProtocol.split('/');
  let path = rest.join('/') || '/';

  return {
    canisterId,
    path,
  };
}

// [TODO] - implement redirect to ICP protocol logic
export function shouldRedirectToIcpProtocol(_url: string): boolean {
  return false;
}

export function getIcpProtocolRedirectUrl(url: string): string {
  return url.replace(/^https?:\/\//, 'icp:');
}

const DEFAULT_DFINITY_GATEWAY = 'https://ic0.app';

export function registerIcpProtocol(): void {
  protocol.registerStreamProtocol('icp', async (protocolRequest, respond) => {
    const icpProtocolUrl = parseIcpProtocolUrl(protocolRequest.url);
    const canisterPrincipal = Principal.fromText(icpProtocolUrl.canisterId);
    const canisterActor = await createCanisterActor(
      DEFAULT_DFINITY_GATEWAY,
      canisterPrincipal,
    );

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
