import { Principal } from '@dfinity/principal';

/**
 * An `icp:` URL brokend down into its consituent parts.
 */
export interface IcpProtocolUrl {
  canisterPrincipal: Principal;
  canisterId: string;
  path: string;
}

/**
 * Parses an `icp:` URL into its consituent parts.
 *
 * @param url The URL to parsed
 * @returns The url parsed into its consituent parts, or null if parsing failed
 */
export function parseIcpProtocolUrl(url: string): IcpProtocolUrl | null {
  const ICP_PROTOCOL_REGEX = /^icp:\/?\/?/;

  if (!url.match(ICP_PROTOCOL_REGEX)) {
    return null;
  }

  const urlWithoutProtocol = url.replace(ICP_PROTOCOL_REGEX, '');
  const [canisterId, ...rest] = urlWithoutProtocol.split('/');
  const path = `/${rest.join('/')}`;

  try {
    const canisterPrincipal = Principal.fromText(canisterId);

    return {
      canisterId,
      path,
      canisterPrincipal,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is meant for the IC.
 *
 * @param _url The URL to check
 * @returns True if the the URL is meant for the IC, false otherwise
 */
export function shouldRedirectToIcpProtocolUrl(_url: string): boolean {
  // [TODO] - implement redirect to ICP protocol logic
  return false;
}

/**
 * Translates an `http:` or `https` URL to `icp:`.
 *
 * @param url The URL to translate
 * @returns The translated URL
 */
export function getIcpProtocolRedirectUrl(url: string): string {
  return url.replace(/^https?:\/\//, 'icp:');
}

/**
 * Translates an `icp:` URL to `https:`.
 *
 * @param url The URL to translate
 * @returns The translated URL
 */
export function getHttpsRedirectUrl(url: string): string {
  return url.replace(/^icp:\/?\/?/, 'https://');
}
