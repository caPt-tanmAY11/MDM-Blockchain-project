import React from 'react';
import { Edit3, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types/blockchain';
import { formatINR, formatTimestamp } from '../lib/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
  isGenesis: boolean;
  modifiedTxId: string | null;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isGenesis,
  modifiedTxId,
  onEditTransaction,
}) => {
  if (isGenesis) {
    return (
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-8 text-center">
        <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">Genesis Block Foundation</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
          Block #0 establishes the cryptographic anchor with previous hash sentinel <code>0</code>.
          By design, genesis blocks contain no client payment records.
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-sm">
        No transactions recorded in this block.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
            <th className="py-2.5 px-3 font-semibold">Tx ID & Ref</th>
            <th className="py-2.5 px-3 font-semibold">Sender & Recipient</th>
            <th className="py-2.5 px-3 font-semibold text-right">Amount (INR)</th>
            <th className="py-2.5 px-3 font-semibold">Description</th>
            <th className="py-2.5 px-3 font-semibold text-right">Simulation Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-sans">
          {transactions.map((tx) => {
            const isModified = modifiedTxId === tx.id;

            return (
              <tr
                key={tx.id}
                className={`transition-colors hover:bg-slate-800/40 ${
                  isModified ? 'bg-rose-950/30 border-l-4 border-l-rose-500' : ''
                }`}
              >
                {/* ID & Reference */}
                <td className="py-3 px-3 align-top">
                  <div className="font-mono text-xs font-bold text-slate-200">{tx.id}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">{tx.reference}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{formatTimestamp(tx.timestamp)}</div>
                  {isModified && (
                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-900/80 text-rose-300 border border-rose-500/40">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Modified for demo
                    </span>
                  )}
                </td>

                {/* Sender & Recipient */}
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-300 font-medium">{tx.sender}</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
                      <span className="text-slate-300">{tx.recipient}</span>
                    </div>
                  </div>
                </td>

                {/* Amount in INR */}
                <td className="py-3 px-3 align-top text-right">
                  <span
                    className={`font-mono text-sm sm:text-base font-bold ${
                      isModified ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatINR(tx.amount)}
                  </span>
                </td>

                {/* Description */}
                <td className="py-3 px-3 align-top max-w-xs text-slate-300 text-xs leading-relaxed">
                  {tx.description}
                </td>

                {/* Simulation Action */}
                <td className="py-3 px-3 align-top text-right">
                  <button
                    id={`tamper-btn-${tx.id}`}
                    type="button"
                    onClick={() => onEditTransaction(tx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-600/50 hover:border-rose-500 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
                    title="Simulate unauthorized database modification without updating block hash"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-rose-300" />
                    <span>Simulate Edit</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
