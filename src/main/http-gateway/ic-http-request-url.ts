import { Principal } from '@dfinity/principal';

const canisterIdMapping = {
  ['nfid.one']: '3y5ko-7qaaa-aaaal-aaaaq-cai',
  ['dscvr.one']: 'h5aet-waaaa-aaaab-qaamq-cai',
  ['oc.app']: '6hsbt-vqaaa-aaaaf-aaafq-cai',
  ['nns.ic0.app']: 'qoctq-giaaa-aaaaa-aaaea-cai',
  ['identity.ic0.app']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  ['identity.icp0.io']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  ['identity.internetcomputer.org']: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
};

/**
 * Extracts a canister ID from a standard request URL intended for a canister that implements the `http_request` interface.
 *
 * @param url The URL to parse.
 * @returns The canister ID as a `Principal`, or `null` if parsing failed.
 */
export function getCanisterIdFromDomain(url: string): Principal | null {
  const { hostname } = new URL(url);

  const canisterId = canisterIdMapping[hostname] ?? hostname.split('.')?.[0];

  try {
    return Principal.fromText(canisterId);
  } catch {
    return null;
  }
}

/**
 * Determines if the given URL is a known Internet Identity URL.
 *
 * @param url The URL to check.
 * @returns `true` if the URL is a known Internet Identity URL, `false` otherwise.
 */
export function isInternetIdentityUrl(url: string): boolean {
  const { hostname } = new URL(url);

  return [
    'rdmx6-jaaaa-aaaaa-aaadq-cai.ic0.app',
    'identity.ic0.app',
    'identity.icp0.io',
    'identity.internetcomputer.org',
  ].includes(hostname);
}
