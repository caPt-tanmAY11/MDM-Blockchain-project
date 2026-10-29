import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Transaction, EditableTransactionFields } from '../types/blockchain';
import { validateTransactionFields } from '../lib/blockchain/tamper';
import { formatINR, formatTimestamp } from '../lib/formatters';

interface TamperTransactionDialogProps {
  isOpen: boolean;
  blockIndex: number;
  transaction: Transaction | null;
  onClose: () => void;
  onApplyTamper: (blockIndex: number, txId: string, fields: EditableTransactionFields) => void;
}

export const TamperTransactionDialog: React.FC<TamperTransactionDialogProps> = ({
  isOpen,
  blockIndex,
  transaction,
  onClose,
  onApplyTamper,
}) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (transaction) {
      setSender(transaction.sender);
      setRecipient(transaction.recipient);
      setAmountStr(transaction.amount.toString());
      setDescription(transaction.description);
      setErrors({});
    }
  }, [transaction, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amountStr);
    const fieldsToValidate: EditableTransactionFields = {
      sender,
      recipient,
      amount: parsedAmount,
      description,
    };

    const validation = validateTransactionFields(fieldsToValidate);
    if (!validation.isValid) {
      setErrors(validation.errors as { [key: string]: string });
      return;
    }

    onApplyTamper(blockIndex, transaction.id, fieldsToValidate);
    onClose();
  };

  const parsedPreviewAmount = parseFloat(amountStr);
  const isPreviewValid = Number.isFinite(parsedPreviewAmount) && parsedPreviewAmount > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tamper-dialog-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dialog Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 id="tamper-dialog-title" className="text-lg font-bold text-white">
              Simulate Unauthorized Edit
            </h3>
            <p className="text-xs text-slate-400">
              Target: <span className="text-teal-300 font-mono">Block #{blockIndex}</span> · Tx:{' '}
              <span className="text-teal-300 font-mono">{transaction.id}</span>
            </p>
          </div>
        </div>

        {/* Educational Notice Banner */}
        <div className="mb-5 bg-rose-950/40 border border-rose-600/40 rounded-xl p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-rose-300">Database Tampering Simulation:</span>{' '}
            This simulates an unauthorized database update. The transaction data will be modified,
            but the original stored hashes and subsequent previous-hash references will intentionally
            NOT be recalculated.
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Read-only metadata row */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Transaction Ref</span>
              <span className="text-slate-300 font-medium">{transaction.reference}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Original Time</span>
              <span className="text-slate-300">{formatTimestamp(transaction.timestamp)}</span>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-300 mb-1">
              Amount (INR) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                ₹
              </span>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                className={`w-full bg-slate-950 border rounded-lg py-2 pl-8 pr-3 text-white font-mono text-sm focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-teal-400'
                }`}
                placeholder="e.g. 9250"
                required
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-400">{errors.amount}</p>
            )}
            {isPreviewValid && (
              <p className="mt-1 text-xs text-slate-400">
                Formatted: <span className="text-teal-300 font-mono">{formatINR(parsedPreviewAmount)}</span>
                {parsedPreviewAmount !== transaction.amount && (
                  <span className="text-rose-400 ml-1.5">(Original was {formatINR(transaction.amount)})</span>
                )}
              </p>
            )}
          </div>

          {/* Sender & Recipient grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-sender" className="block text-xs font-semibold text-slate-300 mb-1">
                Sender Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="tx-sender"
                type="text"
                value={sender}
                onChange={(e) => {
                  setSender(e.target.value);
                  if (errors.sender) setErrors((prev) => ({ ...prev, sender: '' }));
                }}
                className={`w-full bg-slate-950 border rounded-lg py-2 px-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.sender
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-teal-400'
                }`}
                placeholder="Sender Name"
                required
              />
              {errors.sender && (
                <p className="mt-1 text-xs text-rose-400">{errors.sender}</p>
              )}
            </div>

            <div>
              <label htmlFor="tx-recipient" className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="tx-recipient"
                type="text"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: '' }));
                }}
                className={`w-full bg-slate-950 border rounded-lg py-2 px-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.recipient
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-teal-400'
                }`}
                placeholder="Recipient Name"
                required
              />
              {errors.recipient && (
                <p className="mt-1 text-xs text-rose-400">{errors.recipient}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tx-desc" className="block text-xs font-semibold text-slate-300 mb-1">
              Payment Description <span className="text-rose-400">*</span>
            </label>
            <input
              id="tx-desc"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              className={`w-full bg-slate-950 border rounded-lg py-2 px-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:ring-teal-400'
              }`}
              placeholder="Description"
              required
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400">{errors.description}</p>
            )}
          </div>

          {/* Dialog Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              id="apply-tamper-btn"
              type="submit"
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Apply Simulated Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
