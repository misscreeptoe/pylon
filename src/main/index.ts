import fetch from 'node-fetch';
import { App } from './app';

global.fetch = fetch as never;

try {
  new App();
} catch (e) {
  console.error('Error', e);
}
