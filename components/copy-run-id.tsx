'use client';

import { useState } from 'react';

/** Small progressive enhancement: copy the full run ID to the clipboard. */
export function CopyRunId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (permissions/insecure context); the ID
      // remains visible and selectable, so nothing breaks.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="select-all rounded-md bg-ink/5 px-2 py-1 font-mono text-xs text-muted">
        {id}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-ink/40 hover:text-ink"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy ID'}
      </button>
    </div>
  );
}
