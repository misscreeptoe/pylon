import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  getMinVerificationVersion,
  getMaxVerificationVersion,
  verifyRequestResponsePair,
  CertificationResult,
} from '@dfinity/response-verification';
import { ProtocolRequest, ProtocolResponse } from 'electron';
import { getRequestBody, getResponseHeaders } from '../../electron';
import {
  HeaderField,
  HttpRequest,
  HttpResponse,
  idlFactory,
  _SERVICE,
} from '../canister-http-interface';
import { decodeBody } from './decode-body';
import { streamBody } from './stream-body';
import {
  makeHttpRequestUpdate,
  shouldUpgradeToUpdateCall,
} from './upgrade-to-update';

const DEFAULT_API_GATEWAY = 'https://icp-api.io';
const DEFAULT_HTTP_GATEWAY = 'https://ic0.app';

const FORBIDDEN_REQUEST_HEADERS = ['if-none-match'];

export interface Request {
  canisterId: string;
  method: string;
  path: string;
  body?: Buffer;
  headers: Record<string, string>;
}

function requestHasHeader(headers: string[], headerName: string): boolean {
  return Object.keys(headers).some(
    (header) => header.toLowerCase() === headerName.toLowerCase(),
  );
}

function getRequestHeaders(url: URL, request: ProtocolRequest): HeaderField[] {
  const requestHeaders = Object.entries(request.headers).filter(
    ([key, _value]) => !FORBIDDEN_REQUEST_HEADERS.includes(key.toLowerCase()),
  );
  const headerKeys = Object.keys(request.headers);

  if (!requestHasHeader(headerKeys, 'host')) {
    requestHeaders.push(['Host', url.hostname]);
  }

  if (!requestHasHeader(headerKeys, 'accept-encoding')) {
    requestHeaders.push(['Accept-Encoding', 'gzip, deflate, identity']);
  }

  return requestHeaders;
}

function verifyResponse(
  canisterId: Principal,
  rootKey: ArrayBuffer,
  request: HttpRequest,
  response: HttpResponse,
  minVerificationVersion: number,
): CertificationResult {
  const currentTimeMs = Date.now();
  const currentTimeNs = BigInt(currentTimeMs * 1_000_000);
  const maxCertOffsetNs = BigInt(5 * 60 * 1_000_000_000);

  return verifyRequestResponsePair(
    {
      url: request.url,
      headers: request.headers,
      method: request.method,
    },
    {
      statusCode: response.status_code,
      headers: response.headers,
      body: new Uint8Array(response.body),
    },
    canisterId.toUint8Array(),
    currentTimeNs,
    maxCertOffsetNs,
    new Uint8Array(rootKey),
    minVerificationVersion,
  );
}

function getHttpRequest(
  url: URL,
  request: ProtocolRequest,
  certificateVersion: number,
): HttpRequest {
  const requestHeaders = getRequestHeaders(url, request);
  const requestBody = getRequestBody(request);

  return {
    url: url.pathname,
    method: request.method,
    body: requestBody ?? [],
    headers: requestHeaders,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    certificate_version: certificateVersion,
  };
}

export async function makeIcHttpRequest(
  canisterId: Principal,
  request: ProtocolRequest,
): Promise<ProtocolResponse> {
  const url = new URL(request.url, DEFAULT_HTTP_GATEWAY);
  const minVerificationVersion = getMinVerificationVersion();
  const maxVerificationVersion = getMaxVerificationVersion();

  const agent = new HttpAgent({ host: DEFAULT_API_GATEWAY });
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });

  const httpRequest = getHttpRequest(url, request, maxVerificationVersion);
  const httpResponse = await actor.http_request(httpRequest);

  if (shouldUpgradeToUpdateCall(httpResponse)) {
    return await makeHttpRequestUpdate(agent, actor, canisterId, httpRequest);
  }

  if (httpResponse.status_code >= 300 && httpResponse.status_code < 400) {
    return {
      statusCode: 500,
      data: 'Redirects not allowed',
    };
  }

  const body = await streamBody(agent, httpResponse, canisterId);

  const verificationResult = verifyResponse(
    canisterId,
    agent.rootKey,
    {
      ...httpRequest,
      body,
    },
    httpResponse,
    minVerificationVersion,
  );

  if (!verificationResult.passed) {
    return {
      statusCode: 500,
      data: 'Response failed verification',
    };
  }

  const statusCode = httpResponse.status_code;
  const responseHeaders = getResponseHeaders(httpResponse.headers);
  const decodedBody = decodeBody(body, responseHeaders);

  return {
    statusCode,
    headers: responseHeaders,
    data: decodedBody,
  };
}
