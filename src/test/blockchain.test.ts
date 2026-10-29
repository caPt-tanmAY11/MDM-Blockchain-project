import { describe, it, expect } from 'vitest';
import { SEED_BLOCKS, GENESIS_PREVIOUS_HASH } from '../data/seedData';
import { createCanonicalBlockPayload, serializeBlockPayload } from '../lib/blockchain/serialize';
import { sha256, computeBlockHash } from '../lib/blockchain/hash';
import { buildInitialChain } from '../lib/blockchain/buildChain';
import { verifyChain } from '../lib/blockchain/verifyChain';
import { tamperTransactionInChain, validateTransactionFields } from '../lib/blockchain/tamper';
import { Block } from '../types/blockchain';

describe('Blockchain Core Cryptography & Serialization', () => {
  it('excludes stored block hash from canonical payload object', () => {
    const mockBlock: Block = {
      index: 1,
      timestamp: '2025-01-10T10:00:00.000Z',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      nonce: 0,
      hash: 'SHOULD_NOT_BE_IN_PAYLOAD',
      transactions: [
        {
          id: 'tx-1',
          timestamp: '2025-01-10T10:00:00.000Z',
          sender: 'Alice',
          recipient: 'Bob',
          amount: 500,
          currency: 'INR',
          description: 'Test payment',
          reference: 'REF-1',
        },
      ],
    };

    const payload = createCanonicalBlockPayload(mockBlock);
    expect(payload).not.toHaveProperty('hash');
    expect(Object.keys(payload)).toEqual(['index', 'timestamp', 'transactions', 'previousHash', 'nonce']);
    expect(serializeBlockPayload(mockBlock)).not.toContain('SHOULD_NOT_BE_IN_PAYLOAD');
  });

  it('generates a 64-character lowercase hexadecimal SHA-256 digest', async () => {
    const digest = await sha256('Blockchain Transaction Integrity Simulator');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    expect(digest.length).toBe(64);
  });

  it('produces identical SHA-256 digests for identical payloads (determinism)', async () => {
    const block = {
      index: 1,
      timestamp: '2025-01-10T10:00:00.000Z',
      previousHash: '0',
      nonce: 0,
      transactions: [],
    };

    const hash1 = await computeBlockHash(block);
    const hash2 = await computeBlockHash(block);
    expect(hash1).toBe(hash2);
  });

  it('produces different hash when transaction amount changes', async () => {
    const baseBlock = {
      index: 1,
      timestamp: '2025-01-10T10:00:00.000Z',
      previousHash: '0',
      nonce: 0,
      transactions: [
        {
          id: 'tx-1',
          timestamp: '2025-01-10T10:00:00.000Z',
          sender: 'Aarav',
          recipient: 'Priya',
          amount: 2500,
          currency: 'INR' as const,
          description: 'Payment',
          reference: 'REF-1',
        },
      ],
    };

    const originalHash = await computeBlockHash(baseBlock);

    const alteredBlock = {
      ...baseBlock,
      transactions: [
        {
          ...baseBlock.transactions[0],
          amount: 9250, // Modified amount
        },
      ],
    };

    const alteredHash = await computeBlockHash(alteredBlock);
    expect(alteredHash).not.toBe(originalHash);
  });
});

describe('Chain Construction & Seed Integrity', () => {
  it('seeds at least five blocks and at least eight transactions', () => {
    expect(SEED_BLOCKS.length).toBeGreaterThanOrEqual(5);

    const totalTx = SEED_BLOCKS.reduce((sum, b) => sum + b.transactions.length, 0);
    expect(totalTx).toBeGreaterThanOrEqual(8);
  });

  it('builds a pristine sequential chain with proper previousHash links', async () => {
    const chain = await buildInitialChain();
    expect(chain.length).toBe(5);

    // Block 0 is genesis
    expect(chain[0].index).toBe(0);
    expect(chain[0].previousHash).toBe(GENESIS_PREVIOUS_HASH);
    expect(chain[0].transactions.length).toBe(0);
    expect(chain[0].hash).toMatch(/^[0-9a-f]{64}$/);

    // Each non-genesis block links to preceding block's stored hash
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i].previousHash).toBe(chain[i - 1].hash);
      expect(chain[i].hash).toMatch(/^[0-9a-f]{64}$/);
      expect(chain[i].transactions.length).toBeGreaterThan(0);
    }
  });

  it('verifies a pristine chain as 100% VALID', async () => {
    const chain = await buildInitialChain();
    const report = await verifyChain(chain);

    expect(report.isValid).toBe(true);
    expect(report.alteredBlockIndices.length).toBe(0);
    expect(report.brokenLinkIndices.length).toBe(0);
    expect(report.untrustedDescendantIndices.length).toBe(0);

    for (const blockReport of report.blockReports) {
      expect(blockReport.status).toBe('VALID');
      expect(blockReport.hashMatches).toBe(true);
      expect(blockReport.parentLinkMatches).toBe(true);
      expect(blockReport.hasUntrustedAncestor).toBe(false);
      expect(blockReport.chainIsTrusted).toBe(true);
    }
  });
});

describe('Intentional Tampering & Tamper Evidence Verification', () => {
  it('immutably alters a transaction while strictly preserving stored block hashes', async () => {
    const pristineChain = await buildInitialChain();
    const originalBlock2 = pristineChain[2];
    const originalStoredHash = originalBlock2.hash;
    const originalTargetTx = originalBlock2.transactions[0];

    const tamperedChain = tamperTransactionInChain(pristineChain, 2, originalTargetTx.id, {
      sender: 'Aarav Sharma (Tampered)',
      recipient: originalTargetTx.recipient,
      amount: 99999, // Changed from original
      description: 'Illicit database update',
    });

    // Pristine chain not mutated
    expect(pristineChain[2].transactions[0].amount).toBe(originalTargetTx.amount);

    // Tampered block has updated transaction fields
    expect(tamperedChain[2].transactions[0].amount).toBe(99999);
    expect(tamperedChain[2].transactions[0].sender).toBe('Aarav Sharma (Tampered)');

    // CRITICAL: Block 2's stored hash was NOT updated
    expect(tamperedChain[2].hash).toBe(originalStoredHash);

    // CRITICAL: All previousHash fields remain unchanged
    for (let i = 0; i < tamperedChain.length; i++) {
      expect(tamperedChain[i].previousHash).toBe(pristineChain[i].previousHash);
    }
  });

  it('accurately classifies HASH_MISMATCH, BROKEN_LINK, and UNTRUSTED_DESCENDANT', async () => {
    const pristineChain = await buildInitialChain();
    const targetBlockIndex = 2;
    const targetTxId = pristineChain[targetBlockIndex].transactions[0].id;

    const tamperedChain = tamperTransactionInChain(pristineChain, targetBlockIndex, targetTxId, {
      sender: 'Hacker X',
      recipient: 'Shadow Entity',
      amount: 88888,
      description: 'Unauthorized balance diversion',
    });

    const report = await verifyChain(tamperedChain);

    expect(report.isValid).toBe(false);

    // Block 0 and 1 remain completely VALID
    expect(report.blockReports[0].status).toBe('VALID');
    expect(report.blockReports[1].status).toBe('VALID');

    // Block 2 has direct content tampering -> HASH_MISMATCH
    expect(report.blockReports[2].status).toBe('HASH_MISMATCH');
    expect(report.blockReports[2].hashMatches).toBe(false);
    expect(report.alteredBlockIndices).toEqual([2]);

    // Block 3's previousHash points to Block 2's old hash, but Block 2 now recomputes to something else -> BROKEN_LINK
    expect(report.blockReports[3].status).toBe('BROKEN_LINK');
    expect(report.blockReports[3].parentLinkMatches).toBe(false);
    expect(report.brokenLinkIndices).toEqual([3]);

    // Block 4's previousHash matches Block 3's hash, but its ancestor Block 2/3 is invalid -> UNTRUSTED_DESCENDANT
    expect(report.blockReports[4].status).toBe('UNTRUSTED_DESCENDANT');
    expect(report.blockReports[4].hasUntrustedAncestor).toBe(true);
    expect(report.untrustedDescendantIndices).toEqual([4]);
  });

  it('rejects editing genesis block', async () => {
    const pristineChain = await buildInitialChain();
    expect(() => {
      tamperTransactionInChain(pristineChain, 0, 'any-id', {
        sender: 'A',
        recipient: 'B',
        amount: 100,
        description: 'Test',
      });
    }).toThrow('Genesis block transactions cannot be edited');
  });

  it('resets cleanly by rebuilding a brand new valid chain', async () => {
    const pristineChain = await buildInitialChain();
    const tamperedChain = tamperTransactionInChain(pristineChain, 1, pristineChain[1].transactions[0].id, {
      sender: 'Altered',
      recipient: 'Target',
      amount: 50000,
      description: 'Tampered',
    });

    const reportBeforeReset = await verifyChain(tamperedChain);
    expect(reportBeforeReset.isValid).toBe(false);

    // Reset rebuilds pristine chain from immutable seeds
    const resetChain = await buildInitialChain();
    const reportAfterReset = await verifyChain(resetChain);

    expect(reportAfterReset.isValid).toBe(true);
    expect(resetChain[1].transactions[0].amount).toBe(SEED_BLOCKS[1].transactions[0].amount);
  });
});

describe('Transaction Form Validation', () => {
  it('validates required sender, recipient, positive finite amount, and description', () => {
    // Valid input
    const valid = validateTransactionFields({
      sender: 'Aarav',
      recipient: 'Priya',
      amount: 1250.5,
      description: 'College books',
    });
    expect(valid.isValid).toBe(true);
    expect(Object.keys(valid.errors).length).toBe(0);

    // Blank sender
    const emptySender = validateTransactionFields({
      sender: '   ',
      recipient: 'Priya',
      amount: 100,
      description: 'Valid',
    });
    expect(emptySender.isValid).toBe(false);
    expect(emptySender.errors.sender).toBeDefined();

    // Zero or negative amount
    const zeroAmount = validateTransactionFields({
      sender: 'Aarav',
      recipient: 'Priya',
      amount: 0,
      description: 'Valid',
    });
    expect(zeroAmount.isValid).toBe(false);
    expect(zeroAmount.errors.amount).toBeDefined();

    const negativeAmount = validateTransactionFields({
      sender: 'Aarav',
      recipient: 'Priya',
      amount: -50,
      description: 'Valid',
    });
    expect(negativeAmount.isValid).toBe(false);
    expect(negativeAmount.errors.amount).toBeDefined();

    // Non-finite amount
    const nanAmount = validateTransactionFields({
      sender: 'Aarav',
      recipient: 'Priya',
      amount: NaN,
      description: 'Valid',
    });
    expect(nanAmount.isValid).toBe(false);
    expect(nanAmount.errors.amount).toBeDefined();

    // Empty description
    const emptyDesc = validateTransactionFields({
      sender: 'Aarav',
      recipient: 'Priya',
      amount: 100,
      description: '   ',
    });
    expect(emptyDesc.isValid).toBe(false);
    expect(emptyDesc.errors.description).toBeDefined();
  });
});
