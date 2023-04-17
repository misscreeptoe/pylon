# Pylon

> Pylon, the gateway to the inner part of an Ancient Egyptian temple or Christian cathedral - Wikipedia

Pylon is an [Internet Computer](https://internetcomputer.org/) HTTP Gateway that provides a more _trustless_ and _decentralized_ way to access the Internet Computer blockchain.

[Internet Computer HTTP Gateways](https://internetcomputer.org/docs/current/references/ic-interface-spec#http-gateway) translate Internet Computer API calls into standard HTTP calls that a browser can understand. Without an HTTP Gateway, a browser is unable to interact with the Internet Computer network.

## Contents

1. [Introduction](#introduction)
2. [Technical Introduction](#technical-introduction)
3. [Roadmap](#roadmap)
4. [Installation](./docs/INSTALLATION.md)
5. [Build Verification](./docs/BUILD_VERIFICATION.md)
6. [Contributing](./docs/CONTRIBUTING.md)

## Introduction

Pylon is similar, in theory, to an Internet Computer [Boundary Node](https://wiki.internetcomputer.org/wiki/Boundary_Nodes), which is currently the only way to interact with the Internet Computer network. The main practical difference is that it runs locally on your own computer rather than on a centrally controlled remote server.

The Internet Computer [Boundary Nodes](https://wiki.internetcomputer.org/wiki/Boundary_Nodes) provide two flavors of HTTP Gateways:

- ICX Proxy: A service that runs entirely on an Internet Computer Boundary Node. Every time a request is sent through ICX Proxy, the end user is _trusting_ the Boundary Node.
- Service Worker: When a Service Worker is downloaded to an end user's browser, the end user is _trusting_ the Boundary Node to give it the correct Service Worker. Assuming that the user receive's the correct Service Worker, further requests are performed in a _trustless_ manner.

Pylon solves the problem of needing to _trust_ the Boundary Node to deliver the correct Service Worker to your browser. Pylon is open-source and the executable that is downloaded to your computer can be deterministically verified against the codebase, no _trust_ needed. Check the [build verification](./docs/BUILD_VERIFICATION.md) for instructions on how to verify builds.

With the HTTP Gateway logic running locally on an end user's computer, they are able to interact with the Internet Computer in a _trustless_ manner. However, it is still not completely decentralized. Pylon still relies on the API Node of the Internet Comptuer Boundary Nodes to route API calls to the relevant canisters. These API calls are verified locally by Pylon, but they are still routed through centralized servers. This will improve once the API Boundary Nodes are decentraliezd, see this [forum post](https://forum.dfinity.org/t/boundary-node-roadmap/15562) for more details.

## Technical Introduction

Under the hood, Pylon is essentially a [Chromium](https://www.chromium.org/Home/) browser with many browser features stripped out. This function is provided by the [Electron](https://www.electronjs.org/) framework.

Pylon provides the HTTP Gateway functionality by intercepting HTTP requests made by the internal browser and translating them into Internet Computer API calls. This is similar to how the Service Worker implements the HTTP Gateway Protocol.

## Roadmap

Pylon aims to become an Internet Computer homepage, providing a browsing experience tailored to the Internet Computer blockchain.

- Standard browser features
  - Keyboard shortcuts
  - Tab management
  - Bookmarks & reading lists
  - Caching
  - System notifications
- dApp directory
- Privacy and security customization
  - Blocking of centralized analytics and tracking
  - Blocking of other centralized services
    - Content delivery networks
    - Centralized API servers
  - Verification of blackholed or DAO controlled canisters
    - See [this article](https://internetcomputer.org/docs/current/concepts/trust-in-canisters) for more information.
- Self-sovereign identity support
  - [Internet Identity](https://identity.ic0.app/)
  - [Metamask](https://metamask.io/)
  - [NFID](https://nfid.one/)
- Decentralized integrations:
  - Search providers
  - News feeds
  - Notifications inbox
  - Crypto wallets
