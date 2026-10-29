import { Block } from '../../types/blockchain';
import { SEED_BLOCKS, GENESIS_PREVIOUS_HASH, SeedBlockDefinition } from '../../data/seedData';
import { computeBlockHash } from './hash';

/**
 * Builds a pristine, sequentially-linked blockchain from deterministic seed definitions.
 * Each block's stored hash is computed using SHA-256 over its canonical payload,
 * and each subsequent block's previousHash points to the predecessor's stored hash.
 */
export async function buildInitialChain(
  seedDefinitions: readonly SeedBlockDefinition[] = SEED_BLOCKS
): Promise<Block[]> {
  const chain: Block[] = [];
  let currentPreviousHash = GENESIS_PREVIOUS_HASH;

  for (const def of seedDefinitions) {
    // Deep clone transactions to ensure seed definitions remain immutable
    const clonedTransactions = def.transactions.map((tx) => ({ ...tx }));

    const blockCandidate: Omit<Block, 'hash'> = {
      index: def.index,
      timestamp: def.timestamp,
      transactions: clonedTransactions,
      previousHash: currentPreviousHash,
      nonce: def.nonce ?? 0,
    };

    const calculatedHash = await computeBlockHash(blockCandidate);

    const block: Block = {
      ...blockCandidate,
      hash: calculatedHash,
    };

    chain.push(block);
    currentPreviousHash = calculatedHash;
  }

  return chain;
}
