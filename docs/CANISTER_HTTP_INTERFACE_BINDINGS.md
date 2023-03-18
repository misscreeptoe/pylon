# Canister HTTP Interface Bindings

## Notes

Any code snippets or steps that are referenced/quoted are accurate at the time of writing, but may have changed since then. They are copied here directly in case links breaks in the future and to have complete documentation here, rather than a list of links.

## The IC Spec

The IC Canister HTTP Interface that's used by IC HTTP Gateways is defined in Candid in the [IC Interface Spec](https://internetcomputer.org/docs/current/references/ic-interface-spec#http-gateway-interface):

```
type HeaderField = record { text; text; };

type HttpRequest = record {
  method: text;
  url: text;
  headers: vec HeaderField;
  body: blob;
};

type HttpResponse = record {
  status_code: nat16;
  headers: vec HeaderField;
  body: blob;
  upgrade : opt bool;
  streaming_strategy: opt StreamingStrategy;
};

// Each canister that uses the streaming feature gets to choose their concrete
// type; the HTTP Gateway will treat it as an opaque value that is only fed to
// the callback method

type StreamingToken = /* application-specific type */

type StreamingCallbackHttpResponse = record {
  body: blob;
  token: opt StreamingToken;
};

type StreamingStrategy = variant {
  Callback: record {
    callback: func (StreamingToken) -> (opt StreamingCallbackHttpResponse) query;
    token: StreamingToken;
  };
};

service : {
  http_request: (request: HttpRequest) -> (HttpResponse) query;
  http_request_update: (request: HttpRequest) -> (HttpResponse);
}
```

## SDK Asset Canister

The [SDK Asset Canister](https://github.com/dfinity/sdk/blob/master/src/distributed/assetstorage.did) also has Candid types that are a superset of the IC Canister HTTP Interface:

```
type BatchId = nat;
type ChunkId = nat;
type Key = text;
type Time = int;

type CreateAssetArguments = record {
  key: Key;
  content_type: text;
  max_age: opt nat64;
  headers: opt vec HeaderField;
  enable_aliasing: opt bool;
  allow_raw_access: opt bool;
};

// Add or change content for an asset, by content encoding
type SetAssetContentArguments = record {
  key: Key;
  content_encoding: text;
  chunk_ids: vec ChunkId;
  sha256: opt blob;
};

// Remove content for an asset, by content encoding
type UnsetAssetContentArguments = record {
  key: Key;
  content_encoding: text;
};

// Delete an asset
type DeleteAssetArguments = record {
  key: Key;
};

// Reset everything
type ClearArguments = record {};

type BatchOperationKind = variant {
  CreateAsset: CreateAssetArguments;
  SetAssetContent: SetAssetContentArguments;

  UnsetAssetContent: UnsetAssetContentArguments;
  DeleteAsset: DeleteAssetArguments;

  Clear: ClearArguments;
};

type HeaderField = record { text; text; };

type HttpRequest = record {
  method: text;
  url: text;
  headers: vec HeaderField;
  body: blob;
};

type HttpResponse = record {
  status_code: nat16;
  headers: vec HeaderField;
  body: blob;
  streaming_strategy: opt StreamingStrategy;
};

type StreamingCallbackHttpResponse = record {
  body: blob;
  token: opt StreamingCallbackToken;
};

type StreamingCallbackToken = record {
  key: Key;
  content_encoding: text;
  index: nat;
  sha256: opt blob;
};

type StreamingStrategy = variant {
  Callback: record {
    callback: func (StreamingCallbackToken) -> (opt StreamingCallbackHttpResponse) query;
    token: StreamingCallbackToken;
  };
};

type SetAssetPropertiesArguments = record {
  key: Key;
  max_age: opt opt nat64;
  headers: opt opt vec HeaderField;
  allow_raw_access: opt opt bool;
};

service: {
  get: (record {
    key: Key;
    accept_encodings: vec text;
  }) -> (record {
    content: blob; // may be the entirety of the content, or just chunk index 0
    content_type: text;
    content_encoding: text;
    sha256: opt blob; // sha256 of entire asset encoding, calculated by dfx and passed in SetAssetContentArguments
    total_length: nat; // all chunks except last have size == content.size()
  }) query;

  // if get() returned chunks > 1, call this to retrieve them.
  // chunks may or may not be split up at the same boundaries as presented to create_chunk().
  get_chunk: (record {
    key: Key;
    content_encoding: text;
    index: nat;
    sha256: opt blob;  // sha256 of entire asset encoding, calculated by dfx and passed in SetAssetContentArguments
  }) -> (record { content: blob }) query;

  list : (record {}) -> (vec record {
    key: Key;
    content_type: text;
    encodings: vec record {
      content_encoding: text;
      sha256: opt blob; // sha256 of entire asset encoding, calculated by dfx and passed in SetAssetContentArguments
      length: nat; // Size of this encoding's blob. Calculated when uploading assets.
      modified: Time;
    };
  }) query;

  certified_tree : (record {}) -> (record {
    certificate: blob;
    tree: blob;
  }) query;

  create_batch : (record {}) -> (record { batch_id: BatchId });

  create_chunk: (record { batch_id: BatchId; content: blob }) -> (record { chunk_id: ChunkId });

  // Perform all operations successfully, or reject
  commit_batch: (record { batch_id: BatchId; operations: vec BatchOperationKind }) -> ();

  create_asset: (CreateAssetArguments) -> ();
  set_asset_content: (SetAssetContentArguments) -> ();
  unset_asset_content: (UnsetAssetContentArguments) -> ();

  delete_asset: (DeleteAssetArguments) -> ();

  clear: (ClearArguments) -> ();

  // Single call to create an asset with content for a single content encoding that
  // fits within the message ingress limit.
  store: (record {
    key: Key;
    content_type: text;
    content_encoding: text;
    content: blob;
    sha256: opt blob
  }) -> ();

  http_request: (request: HttpRequest) -> (HttpResponse) query;
  http_request_streaming_callback: (token: StreamingCallbackToken) -> (opt StreamingCallbackHttpResponse) query;

  authorize: (principal) -> ();
  deauthorize: (principal) -> ();
  list_authorized: () -> (vec principal) query;

  get_asset_properties : (key: Key) -> (record {
    max_age: opt nat64;
    headers: opt vec HeaderField;
    allow_raw_access: opt bool; } ) query;
  set_asset_properties: (SetAssetPropertiesArguments) -> ();
}
```

## The Dfinity Service Worker

Candid types for the IC Canister HTTP Interface can also be found in the [Dfinity Service Worker](https://github.com/dfinity/ic/blob/master/typescript/service-worker/src/http-interface/canister_http_interface.did):

```
type HeaderField = record { text; text; };

type HttpRequest = record {
  method: text;
  url: text;
  headers: vec HeaderField;
  body: blob;
};

type HttpResponse = record {
  status_code: nat16;
  headers: vec HeaderField;
  body: blob;
  upgrade : opt bool;
  streaming_strategy: opt StreamingStrategy;
};

type Token = variant {
  "type": reserved;
};

type StreamingCallbackHttpResponse = record {
  body: blob;
  token: opt Token;
};

type StreamingStrategy = variant {
  Callback: record {
    callback: func (Token) -> (opt StreamingCallbackHttpResponse) query;
    token: Token;
  };
};

service : {
  http_request: (request: HttpRequest) -> (HttpResponse) query;
  http_request_update: (request: HttpRequest) -> (HttpResponse);
}
```

## Generating

We will use the same Candid interface as the Dfinity Service Worker and use similar steps to generate the JavaScript and Typescript bindings, which were originally defined [here](https://github.com/dfinity/ic/tree/master/typescript/service-worker#generating-http-gateway-bindings).

### Installing Candid

- Download the latest release for your platform from [GitHub](https://github.com/dfinity/candid/releases)
- Place in a directory of your choosing
- Make the file executable
- Add the directory to your `PATH`
- Test your installation with `didc --version`

### JavaScript bindings

Generate the Binding:

```shell
didc bind ./app/canister-http-interface/canister-http-interface.did --target js > ./app/canister-http-interface/canister-http-interface.ts
```

Then move the `StreamingCallbackHttpResponse` variable outside of the `idlFactory` function, rename to `streamingCallbackHttpResponseType` and then export it.

```typescript
export const streamingCallbackHttpResponseType = // ...
```

and then add the `import { IDL } from '@dfinity/candid';` import, move the `Token` variable outside of the `idlFactory` function, and set its value to be `IDL.Unknown`.

```typescript
import { IDL } from '@dfinity/candid';

const Token = IDL.Unknown;
```

### TypeScript Bindings

Generate the binding:

```shell
didc bind ./app/canister-http-interface/canister-http-interface.did --target ts > ./app/canister-http-interface/canister-http-interface-types.ts
```

Add the following import:

```typescript
import { IDL } from '@dfinity/candid';
```

and then replace:

```typescript
export type Token = { type: any };
```

with:

```typescript
export type Token = { type: <T>() => IDL.Type<T> };
```
