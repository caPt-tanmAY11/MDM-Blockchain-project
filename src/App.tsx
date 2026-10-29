import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Block, VerificationReport, Transaction, EditableTransactionFields } from './types/blockchain';
import { buildInitialChain } from './lib/blockchain/buildChain';
import { verifyChain } from './lib/blockchain/verifyChain';
import { tamperTransactionInChain } from './lib/blockchain/tamper';
import { AppHeader } from './components/AppHeader';
import { SummaryMetrics } from './components/SummaryMetricCard';
import { BlockchainView } from './components/BlockchainView';
import { BlockDetailsPanel } from './components/BlockDetailsPanel';
import { TamperTransactionDialog } from './components/TamperTransactionDialog';
import { IntegritySummary } from './components/IntegritySummary';
import { HowItWorks } from './components/HowItWorks';

export const App: React.FC = () => {
  const [chain, setChain] = useState<Block[]>([]);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(2);
  const [modifiedTxId, setModifiedTxId] = useState<string | null>(null);

  // Modal dialog state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Loading & error handling state
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastVerifiedAt, setLastVerifiedAt] = useState<Date | null>(null);

  // Initialize fresh chain on load
  const initializeChain = useCallback(async () => {
    try {
      setIsInitializing(true);
      setErrorMessage(null);

      const pristineChain = await buildInitialChain();
      const initialReport = await verifyChain(pristineChain);

      setChain(pristineChain);
      setReport(initialReport);
      setSelectedBlockIndex(2);
      setModifiedTxId(null);
      setLastVerifiedAt(initialReport.verifiedAt);
    } catch (err) {
      console.error('Initialization failed:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to initialize cryptographic blockchain simulation.'
      );
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeChain();
  }, [initializeChain]);

  // Read-only verification action (never mutates or repairs chain)
  const handleVerify = async () => {
    if (chain.length === 0) return;
    try {
      setIsVerifying(true);
      const freshReport = await verifyChain(chain);
      setReport(freshReport);
      setLastVerifiedAt(freshReport.verifiedAt);
    } catch (err) {
      console.error('Verification failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Verification error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset action to rebuild original valid state
  const handleReset = async () => {
    await initializeChain();
  };

  // Open transaction tamper modal
  const handleOpenEditor = (tx: Transaction) => {
    setEditingTx(tx);
    setIsEditorOpen(true);
  };

  // Commit simulated edit
  const handleApplyTamper = async (
    targetBlockIndex: number,
    txId: string,
    updatedFields: EditableTransactionFields
  ) => {
    try {
      // 1. Mutate only the transaction data in memory; preserve stored hashes and previous links
      const tamperedChain = tamperTransactionInChain(chain, targetBlockIndex, txId, updatedFields);

      // 2. Update chain in state
      setChain(tamperedChain);
      setModifiedTxId(txId);

      // 3. Automatically run verifier against the tampered chain
      setIsVerifying(true);
      const postTamperReport = await verifyChain(tamperedChain);
      setReport(postTamperReport);
      setLastVerifiedAt(postTamperReport.verifiedAt);
    } catch (err) {
      console.error('Tampering simulation failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Error applying tampering.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Derived metrics
  const totalBlocks = chain.length;
  const totalTransactions = chain.reduce((sum, b) => sum + b.transactions.length, 0);
  const isValid = report ? report.isValid : true;

  // Currently selected block
  const selectedBlock = chain.find((b) => b.index === selectedBlockIndex) || chain[0];
  const selectedBlockReport = report?.blockReports.find((r) => r.index === selectedBlockIndex);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Header */}
      <AppHeader
        onVerify={handleVerify}
        onReset={handleReset}
        isVerifying={isVerifying}
        isValid={isValid}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error Alert if crypto fails */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-bold">Cryptographic Simulation Error:</span> {errorMessage}
            </div>
            <button
              type="button"
              onClick={initializeChain}
              className="px-3 py-1 bg-rose-900 hover:bg-rose-800 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Initializing Loading State */}
        {isInitializing ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white">Initializing SHA-256 Ledger Baseline...</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Calculating real Web Crypto digests across genesis and seeded blocks.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Metrics */}
            <SummaryMetrics
              totalBlocks={totalBlocks}
              totalTransactions={totalTransactions}
              isValid={isValid}
              lastVerifiedAt={lastVerifiedAt}
              isInitializing={isInitializing}
            />

            {/* Blockchain Horizontal Ledger View */}
            <BlockchainView
              chain={chain}
              report={report}
              selectedBlockIndex={selectedBlockIndex}
              onSelectBlock={setSelectedBlockIndex}
            />

            {/* Verification Result Breakdown Panel */}
            <IntegritySummary
              report={report}
              onVerify={handleVerify}
              isVerifying={isVerifying}
            />

            {/* Selected Block Details & Transactions Panel */}
            {selectedBlock && (
              <BlockDetailsPanel
                block={selectedBlock}
                report={selectedBlockReport}
                modifiedTxId={modifiedTxId}
                onEditTransaction={handleOpenEditor}
              />
            )}

            {/* Educational Explainer & Limitations */}
            <HowItWorks />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-400">
            ChainTrace — Blockchain Transaction Integrity Simulator
          </p>
          <p className="mt-1">
            FinTech Engineering & Digital Financial Systems · Academic Demonstration Project · Fictional Data Sandbox
          </p>
        </div>
      </footer>

      {/* Transaction Tampering Modal Dialog */}
      <TamperTransactionDialog
        isOpen={isEditorOpen}
        blockIndex={selectedBlockIndex}
        transaction={editingTx}
        onClose={() => setIsEditorOpen(false)}
        onApplyTamper={handleApplyTamper}
      />
    </div>
  );
};

export default App;
