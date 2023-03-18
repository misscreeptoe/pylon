import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';
import { HttpAgent, QueryResponse, QueryResponseStatus } from '@dfinity/agent';
import {
  HttpResponse,
  StreamingCallbackHttpResponse,
  StreamingStrategy,
  Token,
  streamingCallbackHttpResponse,
} from '../canister-http-interface';
import { isJsonObject } from '../candid';

const MAX_CALLBACKS = 1000;

async function streamRemainingChunks(
  agent: HttpAgent,
  canisterId: Principal,
  streamingStrategy: StreamingStrategy,
): Promise<Uint8Array> {
  let remainingChunks = new Uint8Array(0);
  let tokenOpt = streamingStrategy.Callback.token;
  const [, callBackFunc] = streamingStrategy.Callback.callback;

  let currentCallback = 1;
  while (tokenOpt !== null) {
    if (currentCallback > MAX_CALLBACKS) {
      throw new Error('Exceeded streaming callback limit');
    }

    const callbackResponse = await queryNextChunk(
      tokenOpt[0],
      agent,
      canisterId,
      callBackFunc,
    );

    switch (callbackResponse.status) {
      case QueryResponseStatus.Replied: {
        const callbackData = IDL.decode(
          [streamingCallbackHttpResponse],
          callbackResponse.reply.arg,
        )[0];

        if (isStreamingCallbackResponse(callbackData)) {
          const nextChunk = new Uint8Array(callbackData.body);
          remainingChunks = Buffer.concat([remainingChunks, nextChunk]);
          tokenOpt = callbackData.token?.[0] ?? null;
        } else {
          throw new Error('Unexpected callback response: ' + callbackData);
        }
        break;
      }
      case QueryResponseStatus.Rejected: {
        throw new Error('Streaming callback error: ' + callbackResponse);
      }
    }

    currentCallback += 1;
  }

  return remainingChunks;
}

async function queryNextChunk(
  token: Token,
  agent: HttpAgent,
  canisterId: Principal,
  callBackFunc: string,
): Promise<QueryResponse> {
  const tokenType = token.type();

  const tokenValue =
    typeof token.valueOf === 'function' ? token.valueOf() : token;

  const callbackArg = IDL.encode([tokenType], [tokenValue]);

  return await agent.query(canisterId, {
    methodName: callBackFunc,
    arg: callbackArg,
  });
}

function isStreamingCallbackResponse(
  response: unknown,
): response is StreamingCallbackHttpResponse {
  return isJsonObject(response) && 'body' in response && 'token' in response;
}

export async function streamBody(
  agent: HttpAgent,
  response: HttpResponse,
  canisterId: Principal,
): Promise<Uint8Array> {
  let buffer = new Uint8Array(0);
  const firstChunk = new Uint8Array(response.body);
  buffer = Buffer.concat([buffer, firstChunk]);

  if (response.streaming_strategy.length !== 0) {
    const nextChunk = await streamRemainingChunks(
      agent,
      canisterId,
      response.streaming_strategy[0],
    );

    buffer = Buffer.concat([buffer, nextChunk]);
  }

  return new Uint8Array(buffer);
}
