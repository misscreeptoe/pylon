import fetch from 'node-fetch';
import { getHttpsRedirectUrl } from './icp-protocol-url';

/**
 * Redirects an `icp:` URL that was not meant for the IC.
 * This can happen if the frontend code uses a protocol relative URL.
 * We can safely assume that `https:` will work because any canister hosted
 * on the IC will be served through HTTPS.
 *
 * @param request The original protocol request
 * @returns The result of the fallback request
 */
export async function icpHttpsFallbackHandler(
  request: Electron.ProtocolRequest,
): Promise<Electron.ProtocolResponse> {
  const redirectUrl = getHttpsRedirectUrl(request.url);

  const response = await fetch(redirectUrl, {
    method: request.method,
    headers: request.headers,
    // [TODO] - support POST request bodies
    body: null,
  });

  return {
    statusCode: response.status,
    data: await response.buffer(),
    headers: response.headers.raw(),
  };
}
