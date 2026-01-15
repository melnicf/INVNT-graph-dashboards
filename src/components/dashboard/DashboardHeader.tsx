'use client';

import { DashboardConfig } from '@/types/dashboard';

interface DashboardHeaderProps {
  config: DashboardConfig;
}

export function DashboardHeader({ config }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          {config.name}
        </h2>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
          {config.chartCount} Charts
        </span>
      </div>
      <p className="text-sm text-[var(--foreground-muted)]">
        {config.description}
      </p>
    </div>
  );
}
