import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  HttpRequest,
  HttpResponse,
  _SERVICE,
  idlFactory,
} from './canister-http-interface';

export class CanisterAgent {
  private readonly actor: ActorSubclass<_SERVICE>;
  private readonly agent: HttpAgent;

  constructor(host: string, principal: Principal) {
    this.agent = new HttpAgent({ host });
    this.actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent: this.agent,
      canisterId: principal,
    });
  }

  public getAgent(): HttpAgent {
    return this.agent;
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
      // [TODO] - support POST request bodies
      body: [],
      headers: requestHeaders,
    };

    return await this.actor.http_request(httpRequest);
  }
}
