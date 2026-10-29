import React from 'react';
import { ShieldCheck, RotateCcw, Play, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  onVerify: () => void;
  onReset: () => void;
  isVerifying: boolean;
  isValid: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onVerify,
  onReset,
  isVerifying,
  isValid,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Product Title */}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-md shadow-teal-500/20 text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    ChainTrace
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-950/80 text-teal-300 border border-teal-500/40">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    Educational Sandbox · Fictional Data
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Blockchain Transaction Integrity Simulator
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Demonstrates how sequential SHA-256 hash chains detect unauthorized changes to financial ledgers.
              Modify any transaction in memory without updating stored hashes, then observe the cryptographic cascade.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-center">
            <button
              id="verify-chain-button"
              type="button"
              onClick={onVerify}
              disabled={isVerifying}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isValid
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/40 focus:ring-teal-400'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 focus:ring-rose-400 animate-pulse'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Recalculate SHA-256 hashes across current chain state"
            >
              <Play className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying...' : 'Verify Chain'}</span>
            </button>

            <button
              id="reset-demo-button"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              title="Rebuild original pristine seed chain with fresh valid hashes"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
