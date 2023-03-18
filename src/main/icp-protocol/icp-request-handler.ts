import { CanisterAgent } from '../canister-agent';
import { decodeBody } from './decode-body';
import { parseIcpProtocolUrl } from './icp-protocol-url';

const DEFAULT_DFINITY_GATEWAY = 'https://ic0.app';

export async function icpRequestHandler(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  const url = parseIcpProtocolUrl(request.url);
  const canisterActor = new CanisterAgent(
    DEFAULT_DFINITY_GATEWAY,
    url.canisterId,
  );

  const canisterResponse = await canisterActor.httpRequest(
    request.method,
    url.path,
    request.headers,
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

  const body = new Uint8Array(canisterResponse.body);
  const data = decodeBody(body, headers);

  return {
    statusCode,
    headers,
    data,
  };
}
