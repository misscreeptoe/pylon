import { protocol } from 'electron';
import { CanisterAgent } from './canister-agent';
import * as pako from 'pako';

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
  let path = `/${rest.join('/')}`;

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

function decodeBody(body: Uint8Array, encoding: string): Uint8Array {
  switch (encoding) {
    case 'identity':
    case '':
      return body;
    case 'gzip':
    case 'deflate':
      return pako.inflate(body);
    default:
      throw new Error(`Unsupported encoding: "${encoding}"`);
  }
}

function getContentEncoding(headers: Record<string, string>): string {
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase().trim() === 'content-encoding') {
      return value.trim();
    }
  }

  return '';
}

export function registerIcpProtocol(): void {
  protocol.registerBufferProtocol('icp', async (protocolRequest, respond) => {
    const icpProtocolUrl = parseIcpProtocolUrl(protocolRequest.url);
    const canisterActor = new CanisterAgent(
      DEFAULT_DFINITY_GATEWAY,
      icpProtocolUrl.canisterId,
    );

    const canisterResponse = await canisterActor.httpRequest(
      protocolRequest.method,
      icpProtocolUrl.path,
      protocolRequest.headers,
    );

    // [TODO] - certify asset

    const statusCode = canisterResponse.status_code;
    const headers = canisterResponse.headers.reduce(
      (accum, [name, value]) => ({
        ...accum,
        [name]: value,
      }),
      {} as Record<string, string>,
    );
    const encoding = getContentEncoding(headers);

    const body = new Uint8Array(canisterResponse.body);
    const decodedBody = decodeBody(body, encoding);
    const data = Buffer.from(decodedBody ?? body);

    const protocolResponse: Electron.ProtocolResponse = {
      statusCode,
      headers,
      data,
    };

    return respond(protocolResponse);
  });
}
