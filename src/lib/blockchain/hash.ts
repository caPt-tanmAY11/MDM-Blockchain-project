import { Block } from '../../types/blockchain';
import { serializeBlockPayload } from './serialize';

/**
 * Computes the real SHA-256 cryptographic digest of a string using the Web Crypto API
 * and converts the output to a 64-character lowercase hexadecimal string.
 */
export async function sha256(data: string): Promise<string> {
  const subtleCrypto = typeof window !== 'undefined' && window.crypto ? window.crypto.subtle : globalThis.crypto?.subtle;

  if (!subtleCrypto) {
    throw new Error(
      'Web Crypto API (crypto.subtle) is not supported in this runtime environment.'
    );
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await subtleCrypto.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toLowerCase();
}

/**
 * Computes the real SHA-256 hash of a block's canonical payload.
 */
export async function computeBlockHash(
  block: Pick<Block, 'index' | 'timestamp' | 'transactions' | 'previousHash' | 'nonce'>
): Promise<string> {
  const canonicalString = serializeBlockPayload(block);
  return sha256(canonicalString);
}
