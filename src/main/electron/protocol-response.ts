import { ProtocolResponse } from 'electron';

/**
 * Extracts the body from the provided `ProtocolResponse` object as a `Buffer`.
 *
 * @param response The `ProtocolResponse` object to extract the body from.
 * @returns The extracted body as a `Buffer` if it exists, `null` otherwise.
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

/**
 * Transforms an array of header tuples in an object with key/value pairs.
 *
 * @param headers The headers to transform.
 * @returns The headers as an object with key/value pairs.
 */
export function getResponseHeaders(
  headers: [string, string][],
): Record<string, string> {
  return headers.reduce(
    (accum, [name, value]) => ({
      ...accum,
      [name]: value,
    }),
    {} as Record<string, string>,
  );
}
