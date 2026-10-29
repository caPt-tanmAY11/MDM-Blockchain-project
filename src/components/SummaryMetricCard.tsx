import React from 'react';
import { Layers, ArrowLeftRight, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { formatTimestamp } from '../lib/formatters';

interface SummaryMetricsProps {
  totalBlocks: number;
  totalTransactions: number;
  isValid: boolean;
  lastVerifiedAt: Date | null;
  isInitializing: boolean;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  totalBlocks,
  totalTransactions,
  isValid,
  lastVerifiedAt,
  isInitializing,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: Blocks */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Blocks</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-teal-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isInitializing ? '-' : totalBlocks}
          </span>
          <span className="text-xs text-slate-400">blocks</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Genesis + 4 regular blocks
        </div>
      </div>

      {/* Metric 2: Total Transactions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Transactions</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-cyan-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isInitializing ? '-' : totalTransactions}
          </span>
          <span className="text-xs text-slate-400">records</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Fictional INR payments
        </div>
      </div>

      {/* Metric 3: Overall Chain Status */}
      <div
        className={`border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-colors ${
          isValid
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/30 border-rose-500/50 glow-error'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Chain Status
          </span>
          <div
            className={`p-1.5 rounded-lg ${
              isValid ? 'bg-emerald-900/50 text-emerald-400' : 'bg-rose-900/50 text-rose-300'
            }`}
          >
            {isValid ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              isValid ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isInitializing ? 'INITIALIZING' : isValid ? 'VALID' : 'INTEGRITY FAILURE'}
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-400">
          {isValid ? 'Cryptographic links verified' : 'Unauthorized tampering detected'}
        </div>
      </div>

      {/* Metric 4: Last Verified Time */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Last Verified</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-sm sm:text-base font-semibold text-slate-200 truncate">
          {isInitializing
            ? 'Building baseline...'
            : lastVerifiedAt
            ? formatTimestamp(lastVerifiedAt.toISOString())
            : 'Pending'}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Deterministic Web Crypto check
        </div>
      </div>
    </div>
  );
};
