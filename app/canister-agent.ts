import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from './canister-http-interface/canister-http-interface';
import {
  HttpRequest,
  HttpResponse,
  _SERVICE,
} from './canister-http-interface/canister-http-interface-types';

export class CanisterAgent {
  private readonly actor: ActorSubclass<_SERVICE>;

  constructor(host: string, canisterId: string) {
    const principal = Principal.fromText(canisterId);

    const agent = new HttpAgent({ host });
    this.actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId: principal,
    });
  }

  public async httpRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
  ): Promise<HttpResponse> {
    const requestHeaders = Object.entries(headers);
    requestHeaders.push(['Accept-Encoding', 'gzip, deflate, identity']);

    const httpRequest: HttpRequest = {
      url,
      method,
      body: [],
      headers: requestHeaders,
    };

    return await this.actor.http_request(httpRequest);
  }
}
