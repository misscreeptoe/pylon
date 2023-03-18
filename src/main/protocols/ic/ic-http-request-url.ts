import { Principal } from '@dfinity/principal';

const canisterIdMapping = {
  ['nfid.one']: '3y5ko-7qaaa-aaaal-aaaaq-cai',
  ['dscvr.one']: 'h5aet-waaaa-aaaab-qaamq-cai',
  ['nns.ic0.app']: 'qoctq-giaaa-aaaaa-aaaea-cai',
  ['identity.ic0.app']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  ['identity.icp0.io']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  ['identity.internetcomputer.org']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
};

/**
 * A parsed IC request URL broken down into its consituent parts.
 */
export interface IcRequestUrl {
  canisterId: string;
  path: string;
}

/**
 * Parses a standard URL that is intended for a canister that implements the `http_request` interface.
 * It will return the canister ID and request path.
 *
 * @param url The URL to parse.
 * @returns The URL parsed into its consituent parts, or `null` if parsing failed.
 */
export function tryParseIcHttpRequestUrl(url: string): IcRequestUrl | null {
  const { hostname, pathname } = new URL(url);

  const canisterId = canisterIdMapping[hostname] ?? hostname.split('.')?.[0];

  try {
    const canisterPrincipal = Principal.fromText(canisterId);

    return {
      canisterId: canisterPrincipal.toText(),
      path: pathname,
    };
  } catch {
    return null;
  }
}
