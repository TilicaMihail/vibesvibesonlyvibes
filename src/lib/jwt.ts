import type { TokenPayload } from '@/types';

export function encodeToken(payload: TokenPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json).toString('base64');
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(json) as TokenPayload;

    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
