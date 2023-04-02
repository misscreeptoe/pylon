import { Principal } from '@dfinity/principal';

/**
 * A parsed IC metadata request URL broken down itn its constiuent parts.
 */
export interface IcMetadataRequestUrl {
  canisterId: string;
  method: string;
}

/**
 * Parsed a URL with the `ic-metadata:` protocol.
 *
 * @param url The URL to parse.
 * @returns The URL parsed into its constituent parts, or `null` if parsing failed.
 */
export function tryParseIcMetadataRequestUrl(
  url: string,
): IcMetadataRequestUrl | null {
  const { pathname } = new URL(url);

  const [canisterId, method] = pathname.split('/', 2);

  try {
    const canisterPrincipal = Principal.fromText(canisterId);

    return {
      canisterId: canisterPrincipal.toText(),
      method,
    };
  } catch {
    return null;
  }
}
