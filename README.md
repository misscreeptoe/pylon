# Pylon

Pylon is an [Internet Computer](https://internetcomputer.org/) HTTP Gateway that provides a more _trustless_ and _decentralized_ way to access the Internet Computer blockchain.

[Internet Computer HTTP Gateways](https://internetcomputer.org/docs/current/references/ic-interface-spec#http-gateway) translate Internet Computer API calls into standard HTTP calls that a browser can understood. Without an HTTP Gateway, a browser is not able to interact with the Internet Computer network.

## Introduction

Pylon is similar, in theory, to an Internet Computer [Boundary Node](https://wiki.internetcomputer.org/wiki/Boundary_Nodes), which is currently the only way to interact with the Internet Computer network. The main practical difference is that it runs locally on your own computer rather than on a centrally controlled remote server.

The Internet Computer [Boundary Nodes](https://wiki.internetcomputer.org/wiki/Boundary_Nodes) provide two flavors of HTTP Gateways:

- ICX Proxy: A service that runs entirely on an Internet Computer Boundary Node. Every time a request is sent through ICX Proxy, the end user is _trusting_ the Boundary Node.
- Service Worker: When a Service Worker is downloaded to an end user's browser, the end user is _trusting_ the Boundary Node to give it the correct Service Worker. Assuming that the user receive's the correct Service Worker, further requests are performed in a _trustless_ manner.

Pylon solves the problem of needing to _trust_ the Boundary Node to deliver the correct Service Worker to your browser. Pylon is open-source and the executable that is downloaded to your computer can be deterministically verified against the codebase, no _trust_ needed.

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
- Decentralized search providers
- Decentralized news feeds
- Wallet integrations

## Build Verification

It's not possible to deterministically verify the distributed archives directly because the hash changes depending on the time that the archive was created. So, for now, the best we can do is verify the files that go into the archive.

### Windows

Build verification on Windows must be run directly on Windows using Powershell, not on WSL.

First, install global dependencies:

- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/installation):
  - Set PNPM version: `$Env:PNPM_VERSION = "7.21.0"`
  - Install PNPM: `iwr https://get.pnpm.io/install.ps1 -useb | iex`

Then, open a Powershell terminal and clone the repo:

```powershell
git clone https://github.com/nathanosdev/pylon.git
```

Change directory into the root of the repository:

```powershell
cd .\pylon\
```

Now, install project dependencies:

```powershell
pnpm i --frozen-lockfile
```

Build the project:

```powershell
pnpm package
```

Calculate the hash:

```powershell
.\scripts\check-folder-hash.ps1 .\out\pylon-win32-x64
```

If the previous command fails with an error message like the following:

```powershell
.\scripts\check-folder-hash.ps1 : File C:\pylon\scripts\check-folder-hash.ps1 cannot be loaded because running scripts
is disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ .\scripts\check-folder-hash.ps1 .\out\make\zip\win32\x64\pylon-win32- ...
+ ~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

Enable execution for unsigned scripts by opening Powershell with administrator privileges and running the following:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

### Linux / MacOS

First, install global dependencies:

- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/installation):
  - Set PNPM version: `export PNPM_VERSION=7.21.0`
  - Install PNPM:
    - With `curl`: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
    - Or `wget`: `wget -qO- https://get.pnpm.io/install.sh | sh -`

Then, open a terminal and clone the repo:

```shell
git clone https://github.com/nathanosdev/pylon.git
```

Change directory into the root of the repository:

```shell
cd ./pylon/
```

Now, install project dependencies:

```shell
pnpm i --frozen-lockfile
```

Build the project:

```shell
pnpm package
```

The steps now deviate slightly for Linux and MacOS.

#### Linux

Calculate the hash of the unzipped files:

```shell
./scripts/check-folder-hash.sh ./out/pylon-linux-x64
```

#### MacOS

Calculate the hash of the unzipped files:

```shell
./scripts/check-folder-hash.sh ./out/pylon-darwin-x64
```

## Contributing

If you're interested in contributing to this project, you can get started by reading the [contributing guidelines](./CONTRIBUTING.md).
