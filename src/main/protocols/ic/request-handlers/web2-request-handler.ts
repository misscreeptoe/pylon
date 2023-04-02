import fetch from 'node-fetch';
import { ProtocolRequest, ProtocolResponse } from 'electron';
import { getRequestBody } from '../../../electron';

/**
 * Forwards a `ProtocolRequest` as a Web 2 request.
 * Does not alter the request in any way.
 *
 * @param request The `ProtocolRequest` to forward.
 * @returns The response resulting from forwarding the request.
 */
export async function forwardWeb2Request(
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
    data: Buffer.from(await response.arrayBuffer()),
    headers: response.headers.raw(),
  };
}
