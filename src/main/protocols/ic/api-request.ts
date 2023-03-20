import fetch, { Headers } from 'node-fetch';
import { ProtocolRequest, ProtocolResponse } from 'electron';
import { getRequestBody } from '../../electron';

const DEFAULT_API_GATEWAY = 'icp-api.io';
const API_GATEWAYS = [
  'boundary.dfinity.network',
  'boundary.ic0.app',
  'ic0.app',
  DEFAULT_API_GATEWAY,
];

/**
 * Deteremines if the provided URL is an Internet Computer API call.
 *
 * @param url The URL to check.
 * @returns True if the provided URL is an Internet Computer API call, false otherwise.
 */
export function isIcApiRequest(url: string): boolean {
  const { pathname, hostname } = new URL(url);

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  return API_GATEWAYS.some((apiGateway) => hostname.endsWith(apiGateway));
}

/**
 * Forwards a [request]{@link Electron.ProtocolRequest} as an Internet Computer API request.
 * The URL will be rewritten so that the request is forwarded to an appropriate API gateway.
 * Response content type will be forced to be CBOR,
 * so that malicious responses cannot return JavaScript that will be automatically executed by the browser.
 *
 * @param url The original request [URL]{@link URL}.
 * @param request The original [request]{@link Electron.ProtocolRequest}.
 * @returns The response resulting from forwarding the request.
 */
export async function forwardIcApiRequest(
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  const url = new URL(request.url);
  const body = getRequestBody(request);
  const updatedUrl = [
    'https://',
    DEFAULT_API_GATEWAY,
    url.pathname,
    url.search,
  ].join('');

  const response = await fetch(updatedUrl, {
    method: request.method,
    headers: request.headers,
    body,
  });

  // force the content-type to be cbor as /api/ is exclusively used for canister calls
  const sanitizedHeaders = new Headers(response.headers);
  sanitizedHeaders.set('X-Content-Type-Options', 'nosniff');
  sanitizedHeaders.set('Content-Type', 'application/cbor');

  return {
    statusCode: response.status,
    data: await response.buffer(),
    headers: sanitizedHeaders.raw(),
  };
}
