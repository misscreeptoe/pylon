import { ProtocolRequest, ProtocolResponse } from 'electron';
import { makeIcHttpRequest } from '../../http-gateway';
import { forwardStandardHttpRequest } from './forward-standard-http-request';
import { tryParseIcHttpRequestUrl } from './ic-http-request-url';

export async function icRequestHandler(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  try {
    const parsedIcHttpRequestUrl = tryParseIcHttpRequestUrl(request.url);

    if (!parsedIcHttpRequestUrl) {
      return await forwardStandardHttpRequest(request);
    }

    return await makeIcHttpRequest(parsedIcHttpRequestUrl.canisterId, {
      ...request,
      url: parsedIcHttpRequestUrl.path,
    });
  } catch {
    // [TODO]: Handle error
    return {
      data: '',
    };
  }
}
