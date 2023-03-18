export interface IcpProtocolUrl {
  canisterId: string;
  path: string;
}

export function parseIcpProtocolUrl(url: string): IcpProtocolUrl {
  let urlWithoutProtocol = url.replace(/^icp:\/?\/?/, '');
  let [canisterId, ...rest] = urlWithoutProtocol.split('/');
  let path = `/${rest.join('/')}`;

  return {
    canisterId,
    path,
  };
}

// [TODO] - implement redirect to ICP protocol logic
export function shouldRedirectToIcpProtocolUrl(_url: string): boolean {
  return false;
}

export function getIcpProtocolRedirectUrl(url: string): string {
  return url.replace(/^https?:\/\//, 'icp:');
}
