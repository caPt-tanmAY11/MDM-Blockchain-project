import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Unlink, Copy, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { VerificationReport } from '../types/blockchain';

interface IntegritySummaryProps {
  report: VerificationReport | null;
  onVerify: () => void;
  isVerifying: boolean;
}

export const IntegritySummary: React.FC<IntegritySummaryProps> = ({
  report,
  onVerify,
  isVerifying,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(true);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (!report) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        Chain verification pending...
      </div>
    );
  }

  const { isValid, blockReports, alteredBlockIndices, brokenLinkIndices, untrustedDescendantIndices } = report;

  return (
    <section
      id="integrity-summary-section"
      className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-lg ${
        isValid
          ? 'bg-emerald-950/20 border-emerald-500/40'
          : 'bg-rose-950/20 border-rose-500/60 shadow-rose-950/30'
      }`}
    >
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isValid ? 'bg-emerald-900/60 text-emerald-400' : 'bg-rose-900/70 text-rose-300 animate-pulse'
            }`}
          >
            {isValid ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isValid
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-900/80 text-rose-300 border border-rose-500/50'
                }`}
              >
                {isValid ? 'CHAIN VERIFIED' : 'INTEGRITY BREACH DETECTED'}
              </span>
              <span className="text-xs text-slate-400">Deterministic Web Crypto report</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {isValid ? 'All Blocks & Links Cryptographically Intact' : 'Unauthorized Tampering Exposed'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerifying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
            title="Re-verify chain against current state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Re-verify</span>
          </button>
          <button
            type="button"
            onClick={() => setExpandedDetails((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label={expandedDetails ? 'Collapse detailed findings' : 'Expand detailed findings'}
          >
            {expandedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown If Invalid */}
      {!isValid && expandedDetails && (
        <div className="mt-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Cascade Impact Breakdown
          </h3>

          {/* 1. Direct Content Tampering */}
          {alteredBlockIndices.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>1. Altered Block(s) — Direct Hash Mismatch</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                The transaction content inside these blocks was modified without updating the block's original stored hash.
                Recalculating SHA-256 over current content yields a completely different digest:
              </p>

              <div className="space-y-3">
                {alteredBlockIndices.map((idx) => {
                  const bReport = blockReports.find((r) => r.index === idx);
                  if (!bReport) return null;

                  return (
                    <div key={idx} className="bg-slate-950/70 rounded-lg p-3 border border-rose-900/60 font-mono text-xs">
                      <div className="font-bold text-white mb-2 flex items-center justify-between">
                        <span>Block #{idx}</span>
                        <span className="text-[11px] text-rose-400 font-normal">Direct Content Tampering</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Stored Hash */}
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                            <span>Original Stored Hash:</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(bReport.storedHash, `stored-${idx}`)}
                              className="text-slate-400 hover:text-white"
                              title="Copy full stored hash"
                            >
                              {copiedItem === `stored-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-teal-300 break-all text-[11px] select-all font-mono">
                            {bReport.storedHash}
                          </div>
                        </div>

                        {/* Recomputed Hash */}
                        <div className="p-2.5 rounded bg-rose-950/40 border border-rose-600/60">
                          <div className="flex items-center justify-between text-rose-300 text-[11px] mb-1">
                            <span className="font-semibold">Recomputed Current Hash:</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(bReport.recomputedHash, `recomputed-${idx}`)}
                              className="text-rose-300 hover:text-white"
                              title="Copy full recomputed hash"
                            >
                              {copiedItem === `recomputed-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-rose-200 break-all text-[11px] select-all font-mono font-bold">
                            {bReport.recomputedHash}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. First Downstream Broken Link */}
          {brokenLinkIndices.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                <Unlink className="w-4 h-4 text-amber-400" />
                <span>2. First Broken Link(s) — Predecessor Reference Discrepancy</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                The immediate successor block's <code>previousHash</code> pointer still refers to the parent's old stored hash,
                breaking the cryptographic chain link to the newly recomputed parent hash:
              </p>

              <div className="space-y-3">
                {brokenLinkIndices.map((idx) => {
                  const bReport = blockReports.find((r) => r.index === idx);
                  if (!bReport) return null;

                  return (
                    <div key={idx} className="bg-slate-950/70 rounded-lg p-3 border border-amber-900/60 font-mono text-xs">
                      <div className="font-bold text-white mb-2 flex items-center justify-between">
                        <span>Block #{idx}</span>
                        <span className="text-[11px] text-amber-400 font-normal">Parent Link Severed</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[11px] mb-1">
                            Child's Saved <code>previousHash</code>:
                          </span>
                          <span className="text-amber-300 break-all text-[11px] select-all font-mono">
                            {bReport.actualPreviousHash}
                          </span>
                        </div>

                        <div className="p-2.5 rounded bg-amber-950/40 border border-amber-600/60">
                          <span className="text-amber-300 block text-[11px] font-semibold mb-1">
                            Expected (Parent's Recomputed Current Hash):
                          </span>
                          <span className="text-amber-200 break-all text-[11px] select-all font-mono font-bold">
                            {bReport.expectedPreviousHash}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Later Untrusted Descendants */}
          {untrustedDescendantIndices.length > 0 && (
            <div className="bg-indigo-950/30 border border-indigo-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>3. Untrusted Descendants — Tainted Cryptographic Lineage</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Block(s) #{untrustedDescendantIndices.join(', #')} may internally match their own local transactions,
                but because an earlier ancestor in the chain was broken or tampered with, their historical validity cannot be trusted.
              </p>
              <div className="text-xs font-mono text-indigo-200 bg-slate-950/70 p-2.5 rounded-lg border border-indigo-900/60">
                Ancestry Check: FAILED · Lineage compromised by upstream broken link.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Valid state reassurance */}
      {isValid && (
        <div className="mt-4 pt-4 border-t border-emerald-900/40 text-xs text-emerald-300/90 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Every block's canonical payload SHA-256 matches its stored hash, and every previous-hash pointer correctly references its predecessor.
          </span>
        </div>
      )}
    </section>
  );
};
