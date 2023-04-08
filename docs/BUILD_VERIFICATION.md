# Build Verification

It's not possible to deterministically verify the distributed archives directly because the hash changes depending on the time that the archive was created. So, for now, the best we can do is verify the files that go into the archive.

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

Now, install project dependencies:

```powershell
pnpm i --frozen-lockfile
```

Build the project:

```powershell
pnpm make
```

Calculate the hash:

```powershell
Get-FileHash .\out\make\zip\win32\x64\pylon-win32-x64-0.1.0.zip
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

Now, install project dependencies:

```shell
pnpm i --frozen-lockfile
```

Build the project:

```shell
pnpm make --arch=universal
```

Calculate the hash of the unzipped files:

```shell
sha256sum ./out/make/zip/darwin/universal/pylon-darwin-universal-0.1.0.zip
```

If you get an error about `sha256sum` not being installed, then install [Homebrew](https://brew.sh/) if you do not already have it:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

and then install [coreutils](https://formulae.brew.sh/formula/coreutils):

```shell
brew install coreutils
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

Now, install project dependencies:

```shell
pnpm i --frozen-lockfile
```

Build the project:

```shell
pnpm make
```

Calculate the hash of the unzipped files:

```shell
sha256sum ./out/make/zip/linux/x64/pylon-linux-x64-0.1.0.zip
```
