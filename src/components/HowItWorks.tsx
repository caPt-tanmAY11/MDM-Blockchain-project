import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lock, Network, AlertOctagon, GitCommit } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              How Tamper Detection Works & Educational Limitations
            </h3>
            <p className="text-xs text-slate-400">
              Understanding SHA-256 cryptographic chaining, cascade invalidation, and production blockchain comparisons.
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in duration-200">
          {/* 5-Step Process */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
              <GitCommit className="w-4 h-4" />
              The 5-Step Detection Mechanism
            </h4>
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <li className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-teal-400 block mb-1">1. Canonical Hashing</span>
                Every block computes a 64-character SHA-256 digest over a deterministic canonical representation
                of its index, timestamp, transaction list, and previous-block hash.
              </li>
              <li className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-teal-400 block mb-1">2. Transaction Modification</span>
                Modifying even a single character or paise in a financial record changes the canonical byte sequence
                of that block completely (the avalanche effect of cryptographic hashing).
              </li>
              <li className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-rose-400 block mb-1">3. Direct Stored Mismatch</span>
                In a typical unauthorized database tampering scenario, the attacker edits rows but lacks the authority
                to update ledger headers. The recomputed hash instantly diverges from the originally recorded stored hash.
              </li>
              <li className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-400 block mb-1">4. Broken Downstream Link</span>
                The very next block in the ledger stores a pointer to the original parent hash. When the parent's current
                hash changes, this pointer no longer connects, severing the cryptographic chain.
              </li>
              <li className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-indigo-400 block mb-1">5. Tainted Lineage</span>
                All subsequent blocks—even if their own local transaction content was untouched—inherit a compromised history.
                Because their ancestral foundation is broken, the entire downstream chain cannot be trusted.
              </li>
            </ol>
          </div>

          {/* Educational Limitation Box */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 text-xs">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-300 text-sm mb-1">
                  Educational Simulation Limitations vs. Production Blockchains
                </h5>
                <p className="text-slate-300 mb-2 leading-relaxed">
                  This application demonstrates <strong>tamper-evidence</strong> using a sequential SHA-256 hash chain in local memory.
                  A local hash chain alone is not fully tamper-proof: an adversary with root control over a single local database could
                  hypothetically recalculate all subsequent block hashes and rewrite the entire file.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-amber-900/40 text-slate-400">
                  <div className="flex items-start gap-2">
                    <Network className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Distributed Consensus:</strong> Production networks (Bitcoin, Ethereum, Hyperledger)
                      replicate the ledger across thousands of independent nodes and use consensus rules (Proof-of-Work, Proof-of-Stake, PBFT)
                      to reject any unilateral branch rewrite.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Asymmetric Cryptography:</strong> Real financial transactions require private-key
                      ECDSA/Ed25519 digital signatures to prove sender identity and non-repudiation before inclusion in a block.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
