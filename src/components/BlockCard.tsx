import React, { useState } from 'react';
import { Copy, Check, Hash, ArrowUpRight, ArrowRight, CornerDownRight } from 'lucide-react';
import { Block, BlockVerificationReport } from '../types/blockchain';
import { shortenHash, formatTimestamp } from '../lib/formatters';
import { IntegrityBadge } from './IntegrityBadge';

interface BlockCardProps {
  block: Block;
  report?: BlockVerificationReport;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  report,
  isSelected,
  onSelect,
  isLast,
}) => {
  const [copiedHash, setCopiedHash] = useState<'stored' | 'previous' | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, type: 'stored' | 'previous') => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const status = report?.status ?? 'VALID';
  const isGenesis = block.index === 0;

  // Determine card border styling based on selection and status
  const getCardBorder = () => {
    if (isSelected) {
      return 'border-teal-400 ring-2 ring-teal-500/50 shadow-lg shadow-teal-950/40';
    }
    switch (status) {
      case 'HASH_MISMATCH':
        return 'border-rose-500/80 bg-rose-950/20';
      case 'BROKEN_LINK':
        return 'border-amber-500/70 bg-amber-950/20';
      case 'UNTRUSTED_DESCENDANT':
        return 'border-indigo-500/60 bg-indigo-950/20';
      default:
        return 'border-slate-800 hover:border-slate-700 bg-slate-900/60';
    }
  };

  return (
    <div className="flex items-center shrink-0">
      {/* Block Card Container */}
      <div
        id={`block-card-${block.index}`}
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`w-72 sm:w-80 rounded-xl p-4 cursor-pointer transition-all border text-left focus:outline-none focus:ring-2 focus:ring-teal-400 ${getCardBorder()}`}
      >
        {/* Card Header: Index & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-white">
              Block #{block.index}
            </span>
            {isGenesis && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                Genesis
              </span>
            )}
          </div>
          <IntegrityBadge status={status} size="sm" />
        </div>

        {/* Timestamp */}
        <div className="text-xs text-slate-400 mb-3 truncate">
          {formatTimestamp(block.timestamp)}
        </div>

        {/* Hashes section */}
        <div className="space-y-2 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 font-mono text-xs">
          {/* Previous Hash */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span className="flex items-center gap-1">
                <CornerDownRight className="w-3 h-3 text-slate-500" />
                Previous Hash
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(e, block.previousHash, 'previous')}
                className="hover:text-teal-400 transition-colors p-0.5 rounded"
                title="Copy full previous hash"
                aria-label={`Copy previous hash for block ${block.index}`}
              >
                {copiedHash === 'previous' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <div
              className={`text-slate-300 truncate font-mono text-[11px] ${
                status === 'BROKEN_LINK' ? 'text-amber-300 font-semibold underline decoration-amber-500' : ''
              }`}
              title={block.previousHash}
            >
              {shortenHash(block.previousHash, 6, 6)}
            </div>
          </div>

          {/* Stored Hash */}
          <div className="pt-1.5 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-teal-500" />
                Stored Hash
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(e, block.hash, 'stored')}
                className="hover:text-teal-400 transition-colors p-0.5 rounded"
                title="Copy full stored hash"
                aria-label={`Copy stored hash for block ${block.index}`}
              >
                {copiedHash === 'stored' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <div
              className={`truncate font-mono text-[11px] ${
                status === 'HASH_MISMATCH'
                  ? 'text-rose-300 font-bold underline decoration-rose-500'
                  : 'text-teal-300'
              }`}
              title={block.hash}
            >
              {shortenHash(block.hash, 6, 6)}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>{block.transactions.length} {block.transactions.length === 1 ? 'transaction' : 'transactions'}</span>
          <span className="text-[11px] text-teal-400/90 font-medium flex items-center gap-0.5">
            Details <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Visual Link Connector to Next Block */}
      {!isLast && (
        <div className="hidden sm:flex flex-col items-center justify-center px-2 text-slate-600">
          <div
            className={`flex items-center transition-colors ${
              report?.status === 'BROKEN_LINK'
                ? 'text-amber-400 font-bold'
                : 'text-slate-500'
            }`}
          >
            <div className="w-4 h-0.5 bg-current"></div>
            <ArrowRight className="w-4 h-4 -ml-1 text-current" />
          </div>
          <span className="text-[9px] uppercase tracking-tighter font-mono text-slate-500 mt-1">
            link
          </span>
        </div>
      )}
    </div>
  );
};
