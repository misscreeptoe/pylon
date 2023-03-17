import { join } from 'node:path';

const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

export interface WindowUrl {
  href: string;
  insecure: boolean;
}

export function getWindowUrl(): WindowUrl {
  if (serve) {
    return {
      href: 'http://localhost:4200',
      insecure: true,
    };
  }

  const url = new URL(join('file:', __dirname, '..', 'renderer', 'index.html'));

  return {
    href: url.href,
    insecure: false,
  };
}
