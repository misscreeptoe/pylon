import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from './canister-http-interface/canister-http-interface';
import { _SERVICE } from './canister-http-interface/canister-http-interface-types';

export async function createCanisterActor(
  url: string,
  canisterId: Principal,
): Promise<ActorSubclass<_SERVICE>> {
  const replicaUrl = new URL(url);
  const agent = new HttpAgent({ host: replicaUrl.toString() });

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
}
