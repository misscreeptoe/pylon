import { Actor, HttpAgent } from '@dfinity/agent';
import { ProtocolRequest, ProtocolResponse } from 'electron';
import { getRequestBody } from '../../electron';
import {
  HeaderField,
  HttpRequest,
  idlFactory,
  _SERVICE,
} from '../canister-http-interface';
import { decodeBody } from './decode-body';
import { streamBody } from './stream-body';

const DEFAULT_DFINITY_GATEWAY = 'https://icp-api.io';

export interface Request {
  canisterId: string;
  method: string;
  path: string;
  body?: Buffer;
  headers: Record<string, string>;
}

function getRequestHeaders(headers: Record<string, string>): HeaderField[] {
  const requestHeaders = Object.entries(headers);

  return [...requestHeaders, ['Accept-Encoding', 'gzip, deflate, identity']];
}

function getResponseHeaders(headers: HeaderField[]): Record<string, string> {
  return headers.reduce(
    (accum, [name, value]) => ({
      ...accum,
      [name]: value,
    }),
    {} as Record<string, string>,
  );
}

export async function makeIcHttpRequest(
  canisterId: string,
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  const agent = new HttpAgent({ host: DEFAULT_DFINITY_GATEWAY });
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });

  const requestHeaders = getRequestHeaders(request.headers);
  const requestBody = getRequestBody(request);

  const httpRequest: HttpRequest = {
    url: request.url,
    method: request.method,
    body: requestBody ?? [],
    headers: requestHeaders,
  };

  const response = await actor.http_request(httpRequest);

  const statusCode = response.status_code;
  const responseHeaders = getResponseHeaders(response.headers);
  const body = await streamBody(agent, response, canisterId);
  const decodedBody = decodeBody(body, responseHeaders);

  return {
    statusCode,
    headers: responseHeaders,
    data: decodedBody,
  };
}
