'use client';

import { useState } from 'react';

/** Small progressive enhancement: copy text to the clipboard. */
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
      <code className="select-all rounded-lg bg-sand px-2.5 py-1 font-mono text-xs text-muted">
        {id}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-lg border border-line bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-ember-border hover:text-ember-dark"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy ID'}
      </button>
    </div>
  );
}
