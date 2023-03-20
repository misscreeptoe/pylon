import fetch from 'node-fetch';
import { ProtocolRequest, ProtocolResponse } from 'electron';
import { getRequestBody } from '../../electron';

/**
 * Forwards a [request]{@link Electron.ProtocolRequest} as a standard HTTP request.
 * Does not alter the request in any way.
 *
 * @param request The [request]{@link Electron.ProtocolRequest} to forward.
 * @returns The response resulting from forwarding the request.
 */
export async function forwardStandardHttpRequest(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
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
