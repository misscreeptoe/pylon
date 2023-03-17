import { makeIcHttpRequest } from '../../http-gateway';
import { forwardStandardHttpRequest } from './forward-standard-http-request';
import { tryParseIcHttpRequestUrl } from './ic-http-request-url';

export async function icRequestHandler(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  try {
    const parsedIcHttpRequestUrl = tryParseIcHttpRequestUrl(request.url);

    if (!parsedIcHttpRequestUrl) {
      return await forwardStandardHttpRequest(request);
    }

    return makeIcHttpRequest(parsedIcHttpRequestUrl.canisterId, {
      ...request,
      url: parsedIcHttpRequestUrl.path,
    });
  } catch {
    return {
      data: '',
    };
  }
}
