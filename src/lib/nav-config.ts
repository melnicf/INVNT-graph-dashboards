import { safeDashboardReturnPath } from '@/lib/safe-return-path';

/** Shared labels and routes for main product navigation (dashboard layout + client portal). */

export const secondaryNavLinks = [
  { href: '/process', label: 'Process' },
  { href: '/faq', label: 'FAQ' },
] as const;

/** Preserve client preview return URL on FAQ / Process (super-admin view-as-client). */
export function resourcePageHref(path: string, homeHref: string) {
  if (homeHref.startsWith('/view-client/')) {
    return `${path}?${new URLSearchParams({ return: homeHref }).toString()}`;
  }
  return path;
}

/** Keep `?return=` when switching between FAQ/Process (from URL). */
export function hrefPreservingReturn(path: string, returnFromSearch: string | null) {
  const safe = safeDashboardReturnPath(returnFromSearch);
  if (!safe) return path;
  return `${path}?${new URLSearchParams({ return: safe }).toString()}`;
}

/** Process / FAQ inside the segmented control on the top bar. */
export function resourceNavSegmentClass(active: boolean): string {
  return `inline-flex min-h-10 min-w-[4.75rem] shrink-0 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all duration-200 ${
    active
      ? 'bg-[var(--background-card)] text-[var(--foreground)] shadow-[0_1px_3px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.06]'
      : 'text-[var(--foreground-muted)] hover:bg-[var(--background-card)]/50 hover:text-[var(--foreground-secondary)]'
  }`;
}

export const resourceNavGroupClass =
  'inline-flex items-center gap-0.5 rounded-xl border border-[var(--border-primary)]/45 bg-[var(--background-tertiary)]/60 p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

/** Dashboard tab (Predictive / Live / Post Insights). */
export function dashboardTabClass(active: boolean, disabled = false): string {
  const base =
    'relative min-h-[42px] min-w-0 flex-1 rounded-xl px-2 text-center text-xs font-semibold tracking-tight outline-none transition-[color,box-shadow,background-color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-secondary)] sm:w-[9.5rem] sm:flex-initial sm:px-3 sm:text-[0.8125rem]';

  if (disabled) {
    return `${base} cursor-not-allowed text-[var(--foreground-muted)]/35`;
  }
  if (active) {
    return `${base} bg-[var(--accent-primary)] text-white shadow-[0_4px_20px_-6px_rgba(139,92,246,0.65),inset_0_1px_0_0_rgba(255,255,255,0.14)]`;
  }
  return `${base} text-[var(--foreground-muted)] hover:bg-[var(--background-card)]/70 hover:text-[var(--foreground)]`;
}

export const dashboardTabRailClass =
  'inline-flex w-full min-w-0 items-center gap-0.5 rounded-2xl border border-[var(--border-primary)]/55 bg-[var(--background-secondary)]/95 p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_24px_-16px_rgba(0,0,0,0.5)] sm:w-auto';

export const mainDashboardTabs = [
  {
    key: 'predictive',
    href: '/predictive',
    name: 'Predictive Analytics',
    shortName: 'Predictive',
  },
  { key: 'production', href: '/live', name: 'Live', shortName: 'Live' },
  {
    key: 'client',
    href: '/post-insights',
    name: 'Post Insights',
    shortName: 'Post Insights',
    badge: 'coming' as const,
  },
] as const;

export type MainDashboardTabKey = (typeof mainDashboardTabs)[number]['key'];
