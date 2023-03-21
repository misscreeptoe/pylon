import { Principal } from '@dfinity/principal';
import { ProtocolRequest } from 'electron';
import { getResponseBody } from '../../electron';
import { makeIcHttpRequest } from '../../http-gateway';
import { Metadata } from './metadata-parser';

export interface EnrichedMetadata extends Metadata {
  icon: Buffer;
}

export async function enrichMetadata(
  request: ProtocolRequest,
  canisterId: Principal,
  metadata: Metadata,
): Promise<EnrichedMetadata> {
  const iconResponse = await makeIcHttpRequest(canisterId, {
    ...request,
    url: metadata.iconUrl,
  });
  const icon = getResponseBody(iconResponse);

  return {
    ...metadata,
    icon,
  };
}
