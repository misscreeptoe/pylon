import { CanisterAgent } from '../canister-agent';
import { decodeBody } from './decode-body';
import { icpHttpsFallbackHandler } from './icp-https-fallback-handler';
import { parseIcpProtocolUrl } from './icp-protocol-url';
import { streamBody } from './stream-body';

const DEFAULT_DFINITY_GATEWAY = 'https://ic0.app';

export async function icpRequestHandler(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  try {
    // [TODO] - add support for named canisters
    const url = parseIcpProtocolUrl(request.url);

    if (!url) {
      return await icpHttpsFallbackHandler(request);
    }

    const canisterActor = new CanisterAgent(
      DEFAULT_DFINITY_GATEWAY,
      url.canisterPrincipal,
    );

    const canisterResponse = await canisterActor.httpRequest(
      request.method,
      url.path,
      request.headers,
    );

    const body = await streamBody(
      canisterActor.getAgent(),
      canisterResponse,
      url.canisterPrincipal,
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

    const data = decodeBody(body, headers);

    return {
      statusCode,
      headers,
      data,
    };
  } catch {
    return {
      data: '',
    };
  }
}
