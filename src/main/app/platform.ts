import { platform } from 'node:os';

const currentPlatform = platform();

export const isDarwin = currentPlatform === 'darwin';
