import { CanisterAgent } from '../canister-agent';
import { decodeBody } from './decode-body';
import { forwardStandardHttpRequest } from './forward-standard-http-request';
import { tryParseIcHttpRequestUrl } from './ic-http-request-url';
import { streamBody } from './stream-body';

const DEFAULT_DFINITY_GATEWAY = 'https://icp-api.io';

export async function icpRequestHandler(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  try {
    const parsedIcHttpRequestUrl = tryParseIcHttpRequestUrl(request.url);

    if (!parsedIcHttpRequestUrl) {
      return await forwardStandardHttpRequest(request);
    }

    const canisterActor = new CanisterAgent(
      DEFAULT_DFINITY_GATEWAY,
      parsedIcHttpRequestUrl.canisterPrincipal,
    );

    const canisterResponse = await canisterActor.httpRequest(
      request.method,
      parsedIcHttpRequestUrl.path,
      request.headers,
    );

    const body = await streamBody(
      canisterActor.getAgent(),
      canisterResponse,
      parsedIcHttpRequestUrl.canisterPrincipal,
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
