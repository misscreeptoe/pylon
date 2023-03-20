import { ProtocolRequest, ProtocolResponse } from 'electron';
import {
  makeIcHttpRequest,
  tryParseIcHttpRequestUrl,
} from '../../http-gateway';
import { forwardIcApiRequest, isIcApiRequest } from './api-request';
import { forwardStandardHttpRequest } from './forward-standard-http-request';

export async function icRequestHandler(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  try {
    const parsedIcHttpRequestUrl = tryParseIcHttpRequestUrl(request.url);

    if (!parsedIcHttpRequestUrl) {
      if (isIcApiRequest(request.url)) {
        return await forwardIcApiRequest(request);
      }

      return await forwardStandardHttpRequest(request);
    }

    return await makeIcHttpRequest(parsedIcHttpRequestUrl.canisterId, request);
  } catch (error) {
    console.error('Encountered a fatal error');
    console.error('Original request', request);
    console.error('Error', error);

    return {
      statusCode: 500,
      data: String(error),
    };
  }
}
