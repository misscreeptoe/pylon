import { ProtocolRequest, ProtocolResponse } from 'electron';

/**
 * Determines if the provided request should have resolved to an Internet Computer request.
 * This is called if a canister ID cannot be found, so if this returns true then something has gone wrong.
 *
 * @param request The request to check.
 * @returns `true` if the provided request is an Internet Computer request, `false` otherwise.
 */
export function isUnresolvedRequest(request: ProtocolRequest): boolean {
  if (!request.referrer) {
    return false;
  }

  const requestUrl = new URL(request.url);
  const originUrl = new URL(request.referrer);

  return requestUrl.hostname === originUrl.hostname;
}

/**
 * Handles an Internet Computer request that has not resolved correctly.
 *
 * @param request The request to check.
 * @returns The appropriate response for an Internet Computer request that has not resolved correctly.
 */
export function handleUnresolvedRequest(
  request: ProtocolRequest,
): ProtocolResponse {
  return {
    statusCode: 404,
    data: `Canister ID not found for ${request.url}`,
  };
}
