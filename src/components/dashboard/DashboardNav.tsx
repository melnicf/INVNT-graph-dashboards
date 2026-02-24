'use client';

import { DashboardType, dashboardConfigs } from '@/types/dashboard';

interface DashboardNavProps {
  activeDashboard: DashboardType;
  onDashboardChange: (dashboard: DashboardType) => void;
}

export function DashboardNav({ activeDashboard, onDashboardChange }: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-secondary)] bg-[var(--background)]/80 backdrop-blur-xl overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        {/* Live indicator - above navbar */}
        <div className="flex justify-end pt-3 pb-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-[var(--foreground-muted)]">Live</span>
          </div>
        </div>

        {/* Navbar row */}
        <div className="flex items-center justify-between gap-2 min-w-0 pb-4">
          {/* Logo - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-[18px] sm:h-[18px]"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-[var(--foreground)] truncate">INVNT</h1>
              <p className="text-[10px] text-[var(--foreground-muted)] hidden sm:block">Analytics</p>
            </div>
          </div>

          {/* Dashboard Tabs - flex to fit on mobile */}
          <nav className="flex items-center p-1 rounded-lg bg-[var(--background-card)] border border-[var(--border-secondary)] flex-1 min-w-0 justify-center max-w-full sm:max-w-none sm:flex-initial sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <div className="flex items-center w-full sm:w-auto min-w-0">
              {dashboardConfigs.map((config) => (
                <button
                  key={config.id}
                  onClick={() => onDashboardChange(config.id)}
                  className={`
                    relative flex-1 min-w-0 sm:flex-initial sm:w-36 py-2 px-2 sm:px-0 rounded-md text-xs sm:text-sm font-medium text-center truncate
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
            </div>
          </nav>

          {/* Spacer for desktop layout when tabs are absolutely centered */}
          <div className="hidden sm:block w-24 flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}
