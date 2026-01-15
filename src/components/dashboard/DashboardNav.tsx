'use client';

import { DashboardType, dashboardConfigs } from '@/types/dashboard';

interface DashboardNavProps {
  activeDashboard: DashboardType;
  onDashboardChange: (dashboard: DashboardType) => void;
}

export function DashboardNav({ activeDashboard, onDashboardChange }: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-secondary)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-[var(--foreground)]">INVNT</h1>
              <p className="text-[10px] text-[var(--foreground-muted)]">Analytics</p>
            </div>
          </div>

          {/* Dashboard Tabs - Centered */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 rounded-lg bg-[var(--background-card)] border border-[var(--border-secondary)]">
            {dashboardConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => onDashboardChange(config.id)}
                className={`
                  relative w-36 py-2 rounded-md text-sm font-medium text-center
                  transition-all duration-200 ease-out
                  ${
                    activeDashboard === config.id
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }
                `}
              >
                <span className="hidden sm:inline">{config.name}</span>
                <span className="inline sm:hidden">{config.shortName}</span>
              </button>
            ))}
          </nav>

          {/* Right side - minimal */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[var(--foreground-muted)]">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
