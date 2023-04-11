# Build Verification

## Contents

1. [Windows](#windows)
2. [MacOS](#macos)
3. [Linux](#linux)

## Windows

Build verification on Windows must be run directly on Windows using Powershell, not on WSL.

First, install global dependencies:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
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

Set the Pylon version to verify (check the [release page](https://github.com/nathanosdev/pylon/releases) to get the latest version):

```powershell
$Env:PYLON_VERSION = "0.2.1"
```

Fetch git tags:

```powershell
git fetch --all --tags
```

Check out the git tag for the release:

```powershell
git checkout tags/$env:PYLON_VERSION
```

Now, install project dependencies:

```powershell
pnpm i --frozen-lockfile
```

Build the project:

```powershell
pnpm make
```

Download the release file:

```powershell
Invoke-WebRequest -Uri https://github.com/nathanosdev/pylon/releases/download/$env:PYLON_VERSION/pylon-win32-x64-$env:PYLON_VERSION.zip -OutFile .\out\make\zip\win32\x64\pylon-win32-x64-$env:PYLON_VERSION-release.zip
```

Calculate and compare hashes:

```powershell
Get-FileHash -Path .\out\make\zip\win32\x64\pylon-win32-x64-$env:PYLON_VERSION.zip,.\out\make\zip\win32\x64\pylon-win32-x64-$env:PYLON_VERSION-release.zip
```

## MacOS

First, install global dependencies:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
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

Set the Pylon version to verify (check the [release page](https://github.com/nathanosdev/pylon/releases) to get the latest version):

```powershell
export PYLON_VERSION="0.2.1"
```

Fetch git tags:

```powershell
git fetch --all --tags
```

Check out the git tag for the release:

```powershell
git checkout tags/$PYLON_VERSION
```

Now, install project dependencies:

```shell
pnpm i --frozen-lockfile
```

Build the project:

```shell
pnpm make
```

### For M1 or later

Download the release file:

```shell
curl -L https://github.com/nathanosdev/pylon/releases/download/$PYLON_VERSION/pylon-darwin-arm64-$PYLON_VERSION.zip -o ./out/make/zip/darwin/arm64/pylon-darwin-arm64-$PYLON_VERSION-release.zip
```

Calculate and compare hashes:

```shell
sha256sum ./out/make/zip/darwin/arm64/pylon-darwin-arm64-$PYLON_VERSION.zip ./out/make/zip/darwin/arm64/pylon-darwin-arm64-$PYLON_VERSION-release.zip
```

### For pre-M1

Download the release file:

```shell
curl -L https://github.com/nathanosdev/pylon/releases/download/$PYLON_VERSION/pylon-darwin-x64-$PYLON_VERSION.zip -o ./out/make/zip/darwin/x64/pylon-darwin-x64-$PYLON_VERSION-release.zip
```

Calculate and compare hashes:

```shell
sha256sum ./out/make/zip/darwin/x64/pylon-darwin-x64-$PYLON_VERSION.zip ./out/make/zip/darwin/x64/pylon-darwin-x64-$PYLON_VERSION-release.zip
```

## Linux

First, install global dependencies:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
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

Set the Pylon version to verify (check the [release page](https://github.com/nathanosdev/pylon/releases) to get the latest version):

```powershell
export PYLON_VERSION="0.2.1"
```

Fetch git tags:

```powershell
git fetch --all --tags
```

Check out the git tag for the release:

```powershell
git checkout tags/$PYLON_VERSION
```

Now, install project dependencies:

```shell
pnpm i --frozen-lockfile
```

Build the project:

```shell
pnpm make
```

Download the release file:

```shell
curl -L https://github.com/nathanosdev/pylon/releases/download/$PYLON_VERSION/pylon-linux-x64-$PYLON_VERSION.zip -o ./out/make/zip/linux/x64/pylon-linux-x64-$PYLON_VERSION-release.zip
```

Calculate and compare hashes:

```shell
sha256sum ./out/make/zip/linux/x64/pylon-linux-x64-$PYLON_VERSION.zip ./out/make/zip/linux/x64/pylon-linux-x64-$PYLON_VERSION-release.zip
```
