import { ProtocolRequest, ProtocolResponse } from 'electron';
import {
  makeIcHttpRequest,
  getCanisterIdFromDomain,
} from '../../../http-gateway';
import { forwardIcApiRequest, isIcApiRequest } from './api-request-handler';
import {
  handleForbiddenRequest,
  isForbiddenRequest,
} from './forbidden-request-handler';
import { forwardWeb2Request } from './web2-request-handler';
import { forwardRawRequest, isRawRequest } from './raw-request-handler';
import {
  handleUnresolvedRequest,
  isUnresolvedRequest,
} from './unresolved-request-handler';

export async function icRequestHandler(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  try {
    if (isForbiddenRequest(request.url)) {
      return handleForbiddenRequest();
    }

    if (isRawRequest(request.url)) {
      return await forwardRawRequest(request);
    }

    const canisterId = getCanisterIdFromDomain(request.url);
    if (canisterId) {
      return await makeIcHttpRequest(canisterId, request);
    }

    if (isIcApiRequest(request.url)) {
      return await forwardIcApiRequest(request);
    }

    if (isUnresolvedRequest(request)) {
      return handleUnresolvedRequest(request);
    }

    return await forwardWeb2Request(request);
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
