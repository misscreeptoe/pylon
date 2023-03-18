import { ProtocolResponse } from 'electron';

/**
 * Extracts the body from the provided [response]{@link Electron.ProtocolResponse} object as a {@link Buffer}.
 *
 * @param response The [response]{@link Electron.ProtocolResponse} object to extract the body from.
 * @returns The extracted body as a {@link Buffer} if it exists, `null` otherwise.
 */
export function getResponseBody(response: ProtocolResponse): Buffer | null {
  const { data } = response;

  if (typeof data === 'string') {
    return Buffer.from(data);
  }

  if (data instanceof Buffer) {
    return data;
  }

  return null;
}
