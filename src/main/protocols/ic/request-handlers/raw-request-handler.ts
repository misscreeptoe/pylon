import { ProtocolRequest, ProtocolResponse } from 'electron';
import { forwardWeb2Request } from './web2-request-handler';

/**
 * Determines if the provided URL is raw.
 * Raw requests are handled by a remote HTTP Gateway.
 * For security, only certain domains are allowed to be considered raw.
 *
 * @param url The URL to check.
 * @returns `true` if the provided URL is raw, `false` otherwise.
 */
export function isRawRequest(url: string): boolean {
  const { hostname } = new URL(url);

  const isIcAppRaw = !!hostname.match(new RegExp(/\.raw\.ic[0-9]+\.app/));
  const isIcDevRaw = !!hostname.match(new RegExp(/\.raw\.ic[0-9]+\.dev/));
  const isIcpIoRaw = !!hostname.match(new RegExp(/\.raw\.icp[0-9]+\.io/));

  return isIcAppRaw || isIcDevRaw || isIcpIoRaw;
}

/**
 * Forwards a raw `ProtocolRequest`.
 * This is currently handled as a standard hTTP request.
 *
 * @param request The `ProtocolRequest` to forward.
 * @returns The response resulting from forwarding the request.
 */
export async function forwardRawRequest(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  return await forwardWeb2Request(request);
}
