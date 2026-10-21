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
      <code className="select-all font-mono text-xs text-neutral-400">{id}</code>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy ID'}
      </button>
    </div>
  );
}
