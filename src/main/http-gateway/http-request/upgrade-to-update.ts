import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { ProtocolResponse } from 'electron';
import { getResponseHeaders } from '../../electron';
import {
  HttpRequest,
  HttpResponse,
  _SERVICE,
} from '../canister-http-interface';
import { decodeBody } from './decode-body';
import { streamBody } from './stream-body';

export function shouldUpgradeToUpdateCall(response: HttpResponse): boolean {
  return response.upgrade.length === 1 && response.upgrade[0];
}

export async function makeHttpRequestUpdate(
  agent: HttpAgent,
  actor: ActorSubclass<_SERVICE>,
  canisterId: string,
  httpRequest: HttpRequest,
): Promise<ProtocolResponse> {
  const response = await actor.http_request_update(httpRequest);
  const body = await streamBody(agent, response, canisterId);
  const responseHeaders = getResponseHeaders(response.headers);
  const decodedBody = decodeBody(body, responseHeaders);

  return {
    statusCode: response.status_code,
    headers: responseHeaders,
    data: decodedBody,
  };
}
