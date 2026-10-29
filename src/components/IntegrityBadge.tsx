import React from 'react';
import { CheckCircle2, AlertTriangle, Unlink, ShieldAlert } from 'lucide-react';
import { BlockIntegrityStatus } from '../types/blockchain';

interface IntegrityBadgeProps {
  status: BlockIntegrityStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const IntegrityBadge: React.FC<IntegrityBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  switch (status) {
    case 'VALID':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50 ${sizeClasses}`}
          role="status"
          aria-label="Block status: Valid"
        >
          {showIcon && <CheckCircle2 className={`${iconSizes} text-emerald-400 shrink-0`} />}
          <span>VALID</span>
        </span>
      );

    case 'HASH_MISMATCH':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-950/90 text-rose-200 border border-rose-500/60 shadow-sm shadow-rose-950/50 font-semibold animate-pulse ${sizeClasses}`}
          role="status"
          aria-label="Block status: Hash Mismatch (Direct Content Tamper)"
        >
          {showIcon && <AlertTriangle className={`${iconSizes} text-rose-400 shrink-0`} />}
          <span>HASH MISMATCH</span>
        </span>
      );

    case 'BROKEN_LINK':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-950/90 text-amber-200 border border-amber-500/60 shadow-sm shadow-amber-950/50 ${sizeClasses}`}
          role="status"
          aria-label="Block status: Broken Link"
        >
          {showIcon && <Unlink className={`${iconSizes} text-amber-400 shrink-0`} />}
          <span>BROKEN LINK</span>
        </span>
      );

    case 'UNTRUSTED_DESCENDANT':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-indigo-950/80 text-indigo-200 border border-indigo-500/50 shadow-sm shadow-indigo-950/50 ${sizeClasses}`}
          role="status"
          aria-label="Block status: Untrusted Descendant"
        >
          {showIcon && <ShieldAlert className={`${iconSizes} text-indigo-400 shrink-0`} />}
          <span>UNTRUSTED DESCENDANT</span>
        </span>
      );

    default:
      return null;
  }
};
