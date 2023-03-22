import { Input } from 'electron';
import { platform } from 'node:os';

const currentPlatform = platform();
const isDarwin = currentPlatform === 'darwin';

export enum KeyboardShortcutAction {
  nextTab = 'nextTab',
  previousTab = 'previousTab',
  closeCurrentTab = 'closeCurrentTab',
  addNewTab = 'addNewTab',
}

function isCtrl(input: Input): boolean {
  return (isDarwin && input.meta) || input.control;
}

export function getKeyboardShortcutAction(
  input: Input,
): KeyboardShortcutAction | null {
  switch (input.key.toLowerCase()) {
    case 'tab': {
      if (isCtrl(input)) {
        if (input.shift) {
          return KeyboardShortcutAction.previousTab;
        }

        return KeyboardShortcutAction.nextTab;
      }

      break;
    }

    case 'w': {
      if (isCtrl) {
        return KeyboardShortcutAction.closeCurrentTab;
      }

      break;
    }

    case 't': {
      if (isCtrl) {
        return KeyboardShortcutAction.addNewTab;
      }

      break;
    }
  }

  return null;
}
