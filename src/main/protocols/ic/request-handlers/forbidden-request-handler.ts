import { ProtocolResponse } from 'electron';

/**
 * Determines if the provided URL is forbidden.
 *
 * @param url The URL to check.
 * @returns `true` if the provided URL is forbidden, `false` otherwise.
 */
export function isForbiddenRequest(url: string): boolean {
  const { pathname } = new URL(url);

  return pathname.startsWith('/_/');
}

/**
 * Handles a request to a forbidden URL.
 *
 * @returns The appropriate response for forbidden request URLs.
 */
export function handleForbiddenRequest(): ProtocolResponse {
  return {
    statusCode: 400,
  };
}
