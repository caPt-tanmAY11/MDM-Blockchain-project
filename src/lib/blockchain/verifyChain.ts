import { Block, BlockVerificationReport, VerificationReport, BlockIntegrityStatus } from '../../types/blockchain';
import { GENESIS_PREVIOUS_HASH } from '../../data/seedData';
import { computeBlockHash } from './hash';

/**
 * Pure, read-only blockchain verifier.
 * Strictly checks every block in ascending index order:
 * 1. Computes the real SHA-256 hash of current block contents.
 * 2. Compares computed hash to the block's stored hash.
 * 3. Compares block's previousHash to predecessor's recomputed hash (or genesis sentinel for block 0).
 * 4. Checks ancestor trustworthiness.
 * 5. Classifies status by strict precedence: HASH_MISMATCH -> BROKEN_LINK -> UNTRUSTED_DESCENDANT -> VALID.
 * Does not mutate or repair the chain.
 */
export async function verifyChain(chain: readonly Block[]): Promise<VerificationReport> {
  const blockReports: BlockVerificationReport[] = [];
  const alteredBlockIndices: number[] = [];
  const brokenLinkIndices: number[] = [];
  const untrustedDescendantIndices: number[] = [];

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const previousReport: BlockVerificationReport | undefined = blockReports[i - 1];

    // 1. Recompute hash from current payload
    const computedHash = await computeBlockHash(block);

    // 2. Hash match check
    const hashMatches = computedHash === block.hash;

    // 3. Parent link match check
    let parentLinkMatches: boolean;
    let expectedPreviousHash: string;

    if (i === 0) {
      expectedPreviousHash = GENESIS_PREVIOUS_HASH;
      parentLinkMatches = block.previousHash === GENESIS_PREVIOUS_HASH;
    } else {
      // Compare against the parent's recomputed current hash
      expectedPreviousHash = previousReport?.recomputedHash ?? '';
      parentLinkMatches = Boolean(previousReport && block.previousHash === previousReport.recomputedHash);
    }

    // 4. Ancestor trustworthiness
    const hasUntrustedAncestor = i > 0 && previousReport ? !previousReport.chainIsTrusted : false;

    // 5. Chain trusted flag
    const chainIsTrusted = hashMatches && parentLinkMatches && !hasUntrustedAncestor;

    // 6. Precedence status assignment
    let status: BlockIntegrityStatus;
    let explanation: string;

    if (!hashMatches) {
      status = 'HASH_MISMATCH';
      explanation = `Direct tampering detected! Recomputed hash (${computedHash.slice(0, 10)}...) differs from stored hash (${block.hash.slice(0, 10)}...).`;
      alteredBlockIndices.push(block.index);
    } else if (!parentLinkMatches) {
      status = 'BROKEN_LINK';
      explanation = `Broken chain link! This block's previousHash references the old parent hash (${block.previousHash.slice(0, 10)}...), but the parent recomputed to (${expectedPreviousHash.slice(0, 10)}...).`;
      brokenLinkIndices.push(block.index);
    } else if (hasUntrustedAncestor) {
      status = 'UNTRUSTED_DESCENDANT';
      explanation = `Untrusted lineage! This block's local hash matches, but an earlier block in its history is invalid.`;
      untrustedDescendantIndices.push(block.index);
    } else {
      status = 'VALID';
      explanation = i === 0
        ? 'Genesis block verified. Matches genesis sentinel link and stored hash.'
        : 'Block integrity verified. Content hash and cryptographic parent link are intact.';
    }

    const actualPreviousHash = block.previousHash;

    blockReports.push({
      index: block.index,
      storedHash: block.hash,
      recomputedHash: computedHash,
      hashMatches,
      parentLinkMatches,
      hasUntrustedAncestor,
      chainIsTrusted,
      status,
      expectedPreviousHash,
      actualPreviousHash,
      explanation,
    });
  }

  const isValid = blockReports.every((r) => r.chainIsTrusted);

  let summary: string;
  if (isValid) {
    summary = `Chain integrity verified. All ${chain.length} blocks match their stored SHA-256 hashes and previous-hash references.`;
  } else {
    const failureParts: string[] = [];
    if (alteredBlockIndices.length > 0) {
      failureParts.push(`Altered block(s): #${alteredBlockIndices.join(', #')}`);
    }
    if (brokenLinkIndices.length > 0) {
      failureParts.push(`Broken link(s): #${brokenLinkIndices.join(', #')}`);
    }
    if (untrustedDescendantIndices.length > 0) {
      failureParts.push(`Untrusted descendant(s): #${untrustedDescendantIndices.join(', #')}`);
    }
    summary = `Chain integrity failure detected! ${failureParts.join(' | ')}`;
  }

  return {
    isValid,
    blockReports,
    alteredBlockIndices,
    brokenLinkIndices,
    untrustedDescendantIndices,
    summary,
    verifiedAt: new Date(),
  };
}
