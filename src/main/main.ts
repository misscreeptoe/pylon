import fetch from 'node-fetch';
import { App } from './app';

global.fetch = fetch as any;

try {
  console.log('Creating new app');
  new App();
} catch (e) {
  console.error('Error', e);
}
