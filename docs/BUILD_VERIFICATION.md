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

## MacOS

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
pnpm package --arch=universal
```

Calculate the hash of the unzipped files:

```shell
./scripts/check-folder-hash.sh ./out/pylon-darwin-x64
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

Calculate the hash of the unzipped files:

```shell
./scripts/check-folder-hash.sh ./out/pylon-linux-x64
```
