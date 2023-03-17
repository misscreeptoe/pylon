import fetch from 'node-fetch';
import { getRequestBody } from '../../electron';

/**
 * Forwards a request as a standard HTTP request,
 * does not alter the request in any way.
 *
 * @param request The request to forward.
 * @returns The response resulting from forwarding the request.
 */
export async function forwardStandardHttpRequest(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  const body = getRequestBody(request);

  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body,
  });

  return {
    statusCode: response.status,
    data: await response.buffer(),
    headers: response.headers.raw(),
  };
}
