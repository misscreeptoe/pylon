# Installation

Release distributables for all platforms can be found on the [release page](https://github.com/nathanosdev/pylon/releases). Each distributable is named in the following format:

```
pylon-${platform}-${architecture}-${version}.zip
```

- `${platform}` corresponds to your operating system, possible values are:
  - `win32` for Windows 7/10/11
  - `darwin` for Mac OS X (both pre-M1 and M1 or later)
  - `linux` for Linux
- `${platform}` corresponds to your system architecture, possible values are:
  - `x64` for Windows, Linux and pre-M1 Mac OS X
  - `arm64` for M1 or later Mac OS X
- `${version}` corresponds to the application version and will be a number, such as `0.1.0`.

All platforms may show a security warning when running Pylon for the first time. This happens because the executable is not _signed_. Executable signing is a security protocol that operating systems can use to verify that an executable has not been maliciously altered.

For now, the same security can be achieved manually using [build verification](./BUILD_VERIFICATION.md), but in future these executables will be signed depending on adoption/usage of Pylon. A signing certificate can be quite expensive so it doesn't make sense to pay for it while Pylon is in its beta phase.

## Contents

1. [Windows](#windows)
2. [MacOS](#macos)
3. [Linux](#linux)

## Windows

### Install

1. Head over to the [release page](https://github.com/nathanosdev/pylon/releases) and download the `pylon-win32-x64-${version}.zip` file for the latest release. `${version}` will be a version number, such as `0.1.0`.
2. Once downloaded, right-click the file and click `Extract All...`.
3. The application can be started by double clicking the `pylon` file.

### Move Application Folder (Optional)

Move the extracted Pylon folder somewhere that you'd like to keep it, can easily find it in the future and won't accidentally delete it (which might happen if its left in the `Downloads` folder). For example, `C:\pylon\pylon-win32-x64-${version}`, your desktop or your user folder are all viable options.

### Pin to Start (Optional)

This option will enable Pylon to show up in your start menu under `Pinned` apps and will also make it searchable (by pressing `Win` or `Win + S` and typing `Pylon`). This is by far the easiest option so it is recommended for most users.

1. Open the extracted Pylon folder.
2. Right click `pylon`.
3. Click `Pin to Start`.

### Desktop Shortcut (Optional)

This option will enable Pylon to show up on your Desktop. It is a slightly more complicated procedure than [pinning to Start](#pin-to-start-optional).

1. Open the extracted Pylon folder.
2. Right click `pylon`.
3. Click `Create shortcut`.
   - If this option is unavailable, click `Show more options` first.
4. Move the newly created shortcut to your desktop (it will be named `pylon - Shortcut`).
5. Rename it `Pylon`.

### Start Menu Shortcut (Optional)

This option is essentially a much more complicated way to achieve the same result as [pinning to Start](#pin-to-start-optional). It is only recommended for more advanced users who want to have more control over how the Start Menu option is presented.

First step is to open the Start Menu folder. This can by done in a few different ways, choose the one you are most comfortable with:

1. Press `Win + R` on your keyboard (`Win` is the key with the Windows logo on it)
   - Type `shell:start menu`.
   - Press the `Enter` key on your keyboard.
   - Double click the `Programs` folder.
2. Right click the start menu (the Windows icon in the taskbar)
   - Click `Run`.
   - Type `shell:start menu`.
   - Press the `Enter` key on your keyboard.
   - Double click the `Programs` folder.
3. Open Windows Explorer (shortcut is `Win + E`).
   - Click the address bar (shortcut is `Ctrl + L`).
   - Type `%AppData%\Microsoft\Windows\Start Menu\Programs`.
   - Press the `Enter` key on your keyboard.
4. In a different Windows Explorer window, open the extracted Pylon folder.
5. Right click `pylon`.
6. Click `Create shortcut`.
   - If this option is unavailable, click `Show more options` first.
7. Move the newly created shortcut to the `Programs` folder (it will be named `pylon - Shortcut`).
8. Rename it `Pylon`.

### Update

1. Follow the same installation instructions as above.
2. Clean up shortcuts:
   - Unpin the app from the Start Menu.
   - Delete any shortcuts created on the desktop.
   - Delete any shortcuts created in the Start Menu folder.
3. Recreate shortcuts using the same instructions as above.

### Uninstall

1. Clean up shortcuts:
   - Unpin the app from the Start Menu.
   - Delete any shortcuts created on the desktop.
   - Delete any shortcuts created in the Start Menu folder.
2. Delete the extracted Pylon folder wherever it was placed by you.
3. Delete the `%AppData%\Pylon` folder.

## MacOS

### Install

1. Head over to the [release page](https://github.com/nathanosdev/pylon/releases) and download the release file from the latest release for your architecture:
   - `pylon-darwin-x64-${version}.zip` file for pre-M1 Macs.
   - `pylon-darwin-arm64-${version}.zip` file for M1 or later Macs.
   - `${version}` will be a version number, such as `0.1.0`.
2. Once downloaded, double-click the file to extract it.
3. The application can be started by double clicking the `pylon` file.
4. Optionally drag the application file to your `Applications` folder.
5. The extracted folder can be deleted after moving the application file to your `Applications` folder.

### Update

1. Delete the application file from your `Applications` folder.
1. Follow the same installation instructions as above.

### Uninstall

1. Delete the application file from your `Applications` folder.
1. Delete the `~/Library/Application Support/pylon` folder.

## Linux

1. Head over to the [release page](https://github.com/nathanosdev/pylon/releases) and download the `pylon-linux-x64-${version}.zip` file for the latest release. `${version}` will be a version number, such as `0.1.0`.
2. Once downloaded, right-click the file and click `Extract`.
3. The application can be started by double clicking the `pylon` file.

### Move Application Folder (Optional)

Move the extracted Pylon folder somewhere that you'd like to keep it, can easily find it in the future and won't accidentally delete it (which might happen if its left in the `Downloads` folder). For example, your desktop or your user folder are both viable options.

### Create Desktop Launcher (Optional)

Create a file `~/Desktop/Pylon.desktop` and add the following content:

```
[Desktop Entry]
Name=Pylon
Exec=/full/path/to/the/executable
Terminal=false
Type=Application
```

Right click the created file and click `Allow Launching`.

### Create Start Menu Entry (Optional)

Make a copy of the desktop launcher created previously in the `~/.local/share/applications/` directory.

### Update

1. Delete desktop launcher.
2. Delete Start Menu entry.
3. Follow the same installation instructions as above.

### Uninstall

1. Delete desktop launcher.
2. Delete Start Menu entry.
3. Delete the `$XDG_CONFIG_HOME/pylon` or `~/.config/pylon` directory.
