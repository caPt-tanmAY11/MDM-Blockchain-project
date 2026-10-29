import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Block, VerificationReport } from '../types/blockchain';
import { BlockCard } from './BlockCard';

interface BlockchainViewProps {
  chain: Block[];
  report: VerificationReport | null;
  selectedBlockIndex: number;
  onSelectBlock: (index: number) => void;
}

export const BlockchainView: React.FC<BlockchainViewProps> = ({
  chain,
  report,
  selectedBlockIndex,
  onSelectBlock,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md">
      {/* Section Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            Blockchain Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sequential cryptographic chain. Click any block to view transaction ledger details or tamper with data.
          </p>
        </div>

        {/* Scroll Arrows for desktop horizontal view */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Scroll left in blockchain"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Scroll right in blockchain"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Chain Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-2 overflow-x-auto pb-4 pt-2 px-1 focus:outline-none"
        tabIndex={0}
        aria-label="Chain of blocks"
      >
        {chain.map((block, idx) => {
          const blockReport = report?.blockReports.find((r) => r.index === block.index);
          const isSelected = selectedBlockIndex === block.index;
          const isLast = idx === chain.length - 1;

          return (
            <BlockCard
              key={block.index}
              block={block}
              report={blockReport}
              isSelected={isSelected}
              onSelect={() => onSelectBlock(block.index)}
              isLast={isLast}
            />
          );
        })}
      </div>

      {/* Visual Legend */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Info className="w-3.5 h-3.5 text-teal-400" />
          <span>Status Legend:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Valid Block & Link</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Hash Mismatch (Tampered Content)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Broken Link (Parent Hash Discrepancy)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>Untrusted Descendant (Compromised History)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
