'use client';

import { useState } from 'react';

/** Small progressive enhancement: copy text to the clipboard. */
export function CopyRunId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable; ID remains selectable
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-sand/40 p-1">
      <code className="select-all px-2 font-mono text-xs text-ink/80">
        {id}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-muted transition-all hover:border-line hover:text-ink active:scale-95"
        aria-live="polite"
      >
        {copied ? (
          <>
            <span className="text-success font-semibold">✓</span>
            <span className="text-success font-medium">Copied</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span>Copy ID</span>
          </>
        )}
      </button>
    </div>
  );
}
