import React, { useState } from 'react';
import { Copy, Check, Hash, CornerDownRight, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { Block, BlockVerificationReport, Transaction } from '../types/blockchain';
import { formatTimestamp } from '../lib/formatters';
import { IntegrityBadge } from './IntegrityBadge';
import { TransactionTable } from './TransactionTable';

interface BlockDetailsPanelProps {
  block: Block;
  report?: BlockVerificationReport;
  modifiedTxId: string | null;
  onEditTransaction: (tx: Transaction) => void;
}

export const BlockDetailsPanel: React.FC<BlockDetailsPanelProps> = ({
  block,
  report,
  modifiedTxId,
  onEditTransaction,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const status = report?.status ?? 'VALID';
  const hasMismatch = report && !report.hashMatches;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white font-mono">
              Block #{block.index} Details
            </h3>
            <IntegrityBadge status={status} size="md" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Recorded at {formatTimestamp(block.timestamp)} · Nonce: {block.nonce}
          </p>
        </div>

        {report && (
          <div className="text-xs max-w-md bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 text-slate-300">
            <div className="font-semibold text-slate-200 mb-0.5 flex items-center gap-1.5">
              {status === 'VALID' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>Verification Finding:</span>
            </div>
            <p className="text-slate-400 leading-snug">{report.explanation}</p>
          </div>
        )}
      </div>

      {/* Cryptographic Hash Comparison Grid */}
      <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Hash Card */}
        <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
              Parent Link (Previous Hash)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(block.previousHash, 'prev')}
              className="hover:text-teal-400 transition-colors p-1 rounded flex items-center gap-1 text-[11px]"
              title="Copy full previous hash"
            >
              {copiedField === 'prev' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div
            className={`font-mono text-xs break-all select-all p-2 rounded bg-slate-900/80 border ${
              report?.status === 'BROKEN_LINK'
                ? 'border-amber-500/60 text-amber-300 bg-amber-950/20'
                : 'border-slate-800 text-slate-300'
            }`}
          >
            {block.previousHash}
          </div>
          {report?.status === 'BROKEN_LINK' && (
            <div className="mt-1.5 text-[11px] text-amber-400 font-medium flex items-start gap-1">
              <span>Expected:</span>
              <span className="break-all font-mono">{report.expectedPreviousHash}</span>
            </div>
          )}
        </div>

        {/* Stored Block Hash Card */}
        <div
          className={`rounded-xl p-3.5 border ${
            hasMismatch
              ? 'bg-rose-950/20 border-rose-500/60'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Hash className="w-3.5 h-3.5 text-teal-400" />
              Stored Block Hash (SHA-256)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(block.hash, 'stored')}
              className="hover:text-teal-400 transition-colors p-1 rounded flex items-center gap-1 text-[11px]"
              title="Copy full stored hash"
            >
              {copiedField === 'stored' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div
            className={`font-mono text-xs break-all select-all p-2 rounded bg-slate-900/80 border ${
              hasMismatch
                ? 'border-rose-500/60 text-rose-300 font-bold'
                : 'border-slate-800 text-teal-300'
            }`}
          >
            {block.hash}
          </div>

          {/* If there is a mismatch, show the recomputed hash right below */}
          {hasMismatch && report && (
            <div className="mt-3 pt-3 border-t border-rose-900/50">
              <div className="flex items-center justify-between text-xs text-rose-300 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Recomputed SHA-256 (Current Payload)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(report.recomputedHash, 'recomputed')}
                  className="hover:text-rose-200 transition-colors p-1 rounded flex items-center gap-1 text-[11px]"
                  title="Copy recomputed hash"
                >
                  {copiedField === 'recomputed' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs break-all select-all p-2 rounded bg-rose-950/60 border border-rose-500/80 text-rose-200 font-bold">
                {report.recomputedHash}
              </div>
              <p className="mt-1 text-[11px] text-rose-400">
                Notice: The transaction changes changed the recomputed SHA-256 digest, but the stored hash remained unchanged.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            Block Transactions ({block.transactions.length})
          </h4>
          <span className="text-xs text-slate-400">
            {block.index === 0 ? 'Genesis block anchor' : 'Click "Simulate Edit" to test tampering'}
          </span>
        </div>

        <TransactionTable
          transactions={block.transactions}
          isGenesis={block.index === 0}
          modifiedTxId={modifiedTxId}
          onEditTransaction={onEditTransaction}
        />
      </div>
    </div>
  );
};
