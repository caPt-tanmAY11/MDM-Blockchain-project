/**
 * Formats a number as Indian Rupee (INR) currency.
 * Example: 2500 -> "₹2,500.00"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Shortens a 64-character SHA-256 hash for human-readable display.
 * Example: "8cbf...4f2a"
 */
export function shortenHash(hash: string, startChars: number = 8, endChars: number = 8): string {
  if (!hash) return '';
  if (hash === '0') return '0 (Genesis Sentinel)';
  if (hash.length <= startChars + endChars + 3) return hash;
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Formats an ISO 8601 timestamp string into a readable date and time.
 */
export function formatTimestamp(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(date);
  } catch {
    return isoString;
  }
}
