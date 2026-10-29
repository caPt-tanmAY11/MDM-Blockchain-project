import { Block, EditableTransactionFields, TransactionValidationResult } from '../../types/blockchain';

/**
 * Validates editable transaction fields according to business rules:
 * - sender: non-empty after trimming
 * - recipient: non-empty after trimming
 * - amount: finite number strictly greater than 0
 * - description: non-empty after trimming
 */
export function validateTransactionFields(fields: EditableTransactionFields): TransactionValidationResult {
  const errors: TransactionValidationResult['errors'] = {};

  if (!fields.sender || fields.sender.trim().length === 0) {
    errors.sender = 'Sender name is required.';
  }

  if (!fields.recipient || fields.recipient.trim().length === 0) {
    errors.recipient = 'Recipient name is required.';
  }

  if (typeof fields.amount !== 'number' || !Number.isFinite(fields.amount) || fields.amount <= 0) {
    errors.amount = 'Amount must be a positive finite number greater than 0.';
  }

  if (!fields.description || fields.description.trim().length === 0) {
    errors.description = 'Transaction description is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Simulates an unauthorized database-level transaction modification.
 * Mutates ONLY the specified transaction's editable fields inside a new cloned chain.
 * CRITICAL RULE:
 * - Does NOT recalculate the edited block's stored hash.
 * - Does NOT modify any block's previousHash or stored hash.
 * - Does NOT mutate the input chain in place.
 */
export function tamperTransactionInChain(
  chain: readonly Block[],
  blockIndex: number,
  transactionId: string,
  updatedFields: EditableTransactionFields
): Block[] {
  const validation = validateTransactionFields(updatedFields);
  if (!validation.isValid) {
    throw new Error(`Invalid transaction fields: ${JSON.stringify(validation.errors)}`);
  }

  const targetBlock = chain.find((b) => b.index === blockIndex);
  if (!targetBlock) {
    throw new Error(`Block index ${blockIndex} not found in chain.`);
  }

  if (targetBlock.index === 0) {
    throw new Error('Genesis block transactions cannot be edited.');
  }

  const txExists = targetBlock.transactions.some((t) => t.id === transactionId);
  if (!txExists) {
    throw new Error(`Transaction ${transactionId} not found in block ${blockIndex}.`);
  }

  // Create a brand new chain array with deep cloned objects for the affected block
  return chain.map((block) => {
    if (block.index !== blockIndex) {
      // Keep other blocks as is (they are immutable)
      return block;
    }

    // Clone the affected block and update only the targeted transaction
    const newTransactions = block.transactions.map((tx) => {
      if (tx.id !== transactionId) {
        return tx;
      }
      return {
        ...tx,
        sender: updatedFields.sender.trim(),
        recipient: updatedFields.recipient.trim(),
        amount: updatedFields.amount,
        description: updatedFields.description.trim(),
      };
    });

    return {
      ...block,
      transactions: newTransactions,
      // INTENTIONALLY PRESERVE original hash and previousHash
      hash: block.hash,
      previousHash: block.previousHash,
    };
  });
}
