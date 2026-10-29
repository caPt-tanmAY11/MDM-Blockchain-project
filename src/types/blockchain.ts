export interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: 'INR';
  description: string;
  reference: string;
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  nonce: number;
  hash: string;
}

export type BlockIntegrityStatus =
  | 'VALID'
  | 'HASH_MISMATCH'
  | 'BROKEN_LINK'
  | 'UNTRUSTED_DESCENDANT';

export interface BlockVerificationReport {
  index: number;
  storedHash: string;
  recomputedHash: string;
  hashMatches: boolean;
  parentLinkMatches: boolean;
  hasUntrustedAncestor: boolean;
  chainIsTrusted: boolean;
  status: BlockIntegrityStatus;
  expectedPreviousHash: string;
  actualPreviousHash: string;
  explanation: string;
}

export interface VerificationReport {
  isValid: boolean;
  blockReports: BlockVerificationReport[];
  alteredBlockIndices: number[];
  brokenLinkIndices: number[];
  untrustedDescendantIndices: number[];
  summary: string;
  verifiedAt: Date;
}

export interface EditableTransactionFields {
  sender: string;
  recipient: string;
  amount: number;
  description: string;
}

export interface TransactionValidationResult {
  isValid: boolean;
  errors: {
    sender?: string;
    recipient?: string;
    amount?: string;
    description?: string;
  };
}
