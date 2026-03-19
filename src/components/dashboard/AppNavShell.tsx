'use client';

import type { ReactNode } from 'react';

type AppNavShellProps = {
  brand: ReactNode;
  resourceNav: ReactNode;
  trailing: ReactNode;
  /** Omit or pass `null` to hide the dashboard tab row (e.g. FAQ / Process). */
  tabs?: ReactNode | null;
};

/**
 * Top bar (brand · resources · status/actions); optional second row for dashboard tabs.
 */
export function AppNavShell({ brand, resourceNav, trailing, tabs }: AppNavShellProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full overflow-x-hidden border-b border-[var(--border-secondary)] bg-[var(--background)]/75 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/25 to-transparent"
        aria-hidden
      />
      <div className="container mx-auto max-w-full px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5 py-3.5 sm:py-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-6">
            <div className="min-w-0 shrink-0">{brand}</div>
            <div className="hidden h-8 w-px shrink-0 bg-gradient-to-b from-transparent via-[var(--border-accent)]/60 to-transparent sm:block" />
            <div className="flex min-w-0 flex-1 flex-wrap items-center sm:flex-initial">{resourceNav}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">{trailing}</div>
        </div>

        {tabs != null && (
          <div className="flex justify-center border-t border-[var(--border-secondary)]/90 bg-[var(--background)]/30 py-3 sm:py-3.5">
            <div className="w-full max-w-full sm:w-auto">{tabs}</div>
          </div>
        )}
      </div>
    </header>
  );
}
