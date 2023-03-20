import { ProtocolRequest, ProtocolResponse } from 'electron';
import {
  makeIcHttpRequest,
  tryParseIcHttpRequestUrl,
} from '../../http-gateway';
import { forwardStandardHttpRequest } from './forward-standard-http-request';

export async function icRequestHandler(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  try {
    const parsedIcHttpRequestUrl = tryParseIcHttpRequestUrl(request.url);

    if (!parsedIcHttpRequestUrl) {
      return await forwardStandardHttpRequest(request);
    }

    return await makeIcHttpRequest(parsedIcHttpRequestUrl.canisterId, request);
  } catch {
    // [TODO]: Handle error
    return {
      data: '',
    };
  }
}
