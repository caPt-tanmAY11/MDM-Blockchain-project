import { Block } from '../../types/blockchain';

export interface CanonicalBlockPayload {
  index: number;
  timestamp: string;
  transactions: {
    id: string;
    timestamp: string;
    sender: string;
    recipient: string;
    amount: number;
    currency: 'INR';
    description: string;
    reference: string;
  }[];
  previousHash: string;
  nonce: number;
}

/**
 * Creates an explicit canonical payload object with fixed key ordering,
 * strictly excluding the stored block.hash itself.
 */
export function createCanonicalBlockPayload(
  block: Pick<Block, 'index' | 'timestamp' | 'transactions' | 'previousHash' | 'nonce'>
): CanonicalBlockPayload {
  return {
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions.map((tx) => ({
      id: tx.id,
      timestamp: tx.timestamp,
      sender: tx.sender,
      recipient: tx.recipient,
      amount: tx.amount,
      currency: tx.currency,
      description: tx.description,
      reference: tx.reference,
    })),
    previousHash: block.previousHash,
    nonce: block.nonce,
  };
}

/**
 * Returns the deterministic JSON string representing the canonical payload.
 */
export function serializeBlockPayload(
  block: Pick<Block, 'index' | 'timestamp' | 'transactions' | 'previousHash' | 'nonce'>
): string {
  const payload = createCanonicalBlockPayload(block);
  return JSON.stringify(payload);
}
