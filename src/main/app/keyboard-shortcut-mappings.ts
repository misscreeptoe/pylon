import { Input } from 'electron';
import { platform } from 'node:os';

const currentPlatform = platform();
const isDarwin = currentPlatform === 'darwin';

function isCtrl(input: Input): boolean {
  return (isDarwin && input.meta) || input.control;
}

function isKey(input: Input, key: string): boolean {
  return input.key.toLowerCase() === key && input.type === 'keyDown';
}

export function isNextTab(input: Input): boolean {
  return isKey(input, 'tab') && isCtrl(input) && !input.shift;
}

export function isPrevTab(input: Input): boolean {
  return isKey(input, 'tab') && isCtrl(input) && input.shift;
}

export function isReloadCurrentTab(input: Input): boolean {
  return isKey(input, 'r') && isCtrl(input) && !input.shift;
}

export function isHardReloadCurrentTab(input: Input): boolean {
  return isKey(input, 'r') && isCtrl(input) && input.shift;
}

export function isRemoveCurrentTab(input: Input): boolean {
  return isKey(input, 'w') && isCtrl(input) && !input.shift;
}

export function isAddNewTab(input: Input): boolean {
  return isKey(input, 't') && isCtrl(input);
}

export function isToggleDevTools(input: Input): boolean {
  return isKey(input, 'i') && isCtrl(input) && input.shift;
}

export function isNavigateForward(input: Input): boolean {
  return isKey(input, 'arrowright') && input.alt;
}

export function isNavigateBack(input: Input): boolean {
  return isKey(input, 'arrowleft') && input.alt;
}
