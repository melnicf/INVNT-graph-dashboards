'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  dashboardTabClass,
  dashboardTabRailClass,
  mainDashboardTabs,
  resourceNavGroupClass,
  resourceNavSegmentClass,
  resourcePageHref,
  secondaryNavLinks,
} from '@/lib/nav-config';
import { DashboardType, DashboardConfig } from '@/types/dashboard';
import { AppNavShell } from './AppNavShell';
import { NavLivePill } from './NavLivePill';
import { DashboardHeader } from './DashboardHeader';
import { PredictiveAnalyticsDashboard } from './PredictiveAnalyticsDashboard';
import { ProductionDashboard } from './ProductionDashboard';
import { ClientViewDashboard } from './ClientViewDashboard';

interface ClientPortalData {
  client: { name: string; logoUrl: string | null };
  dashboards: { key: string; name: string; description: string | null }[];
  graphs: { key: string; dashboardKey: string }[];
}

interface ClientLandingPageProps {
  data: ClientPortalData;
  /** Client home for logo link (e.g. `/` or `/view-client/[id]`). */
  homeHref?: string;
}

export function ClientLandingPage({
  data,
  homeHref = '/',
}: ClientLandingPageProps) {
  const pathname = usePathname();
  const { client, dashboards, graphs } = data;

  const enabledDash = useMemo(
    () => new Set(dashboards.map((d) => d.key)),
    [dashboards],
  );

  const tabOrder = useMemo(() => mainDashboardTabs.map((t) => t.key), []);
  const [activeKey, setActiveKey] = useState<string>(() => {
    const first = tabOrder.find((k) => enabledDash.has(k));
    return first ?? tabOrder[0] ?? 'predictive';
  });

  useEffect(() => {
    if (!enabledDash.has(activeKey)) {
      const next = tabOrder.find((k) => enabledDash.has(k));
      if (next) setActiveKey(next);
    }
  }, [enabledDash, activeKey, tabOrder]);

  const allowedForActive = useMemo(() => {
    const s = new Set<string>();
    for (const g of graphs) {
      if (g.dashboardKey === activeKey) s.add(g.key);
    }
    return s;
  }, [graphs, activeKey]);

  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [activeKey]);

  const registryDb = dashboards.find((d) => d.key === activeKey);
  const activeConfig: DashboardConfig = {
    id: activeKey as DashboardType,
    name: registryDb?.name ?? '',
    shortName: registryDb?.name ?? '',
    description: registryDb?.description ?? '',
    chartCount: allowedForActive.size,
  };

  function renderDashboardBody() {
    if (!enabledDash.has(activeKey)) {
      return (
        <div className="flex w-full flex-1 min-h-0 flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] px-6 py-16 text-center text-sm text-[var(--foreground-muted)]">
            This dashboard is not enabled for your organization.
          </div>
        </div>
      );
    }

    const allowed = allowedForActive;

    switch (activeKey) {
      case 'predictive':
        return <PredictiveAnalyticsDashboard allowedGraphKeys={allowed} />;
      case 'production':
        return <ProductionDashboard allowedGraphKeys={allowed} />;
      case 'client':
        return <ClientViewDashboard allowedGraphKeys={allowed} />;
      default:
        return (
          <div className="flex w-full flex-1 min-h-0 flex-col items-center justify-center px-4 py-8 text-[var(--foreground-muted)]">
            <div className="text-center">
              <p className="text-lg font-medium mb-2 text-[var(--foreground)]">
                Dashboard coming soon
              </p>
              <p className="text-sm">This dashboard is being prepared for you.</p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(99, 102, 241, 0.1), transparent),
            radial-gradient(ellipse 60% 40% at 0% 100%, rgba(139, 92, 246, 0.08), transparent)
          `,
        }}
      />

      <AppNavShell
        brand={
          <Link
            href={homeHref}
            className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-[background,box-shadow] duration-200 hover:bg-[var(--background-card)]/55 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:gap-3 sm:pr-3"
          >
            {client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={client.name}
                width={40}
                height={40}
                className="size-9 shrink-0 rounded-[10px] object-contain ring-1 ring-white/[0.08] transition-[ring-color,transform] duration-200 group-hover:ring-[var(--accent-primary)]/30 sm:size-10"
              />
            ) : (
              <Image
                src="/invnt-logo.jpg"
                alt="INVNT"
                width={40}
                height={40}
                className="size-9 shrink-0 rounded-[10px] ring-1 ring-white/[0.08] transition-[ring-color] duration-200 group-hover:ring-[var(--accent-primary)]/30 sm:size-10"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-[0.9375rem]">
                {client.name}
              </p>
              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-muted)] sm:block">
                Intelligence Engine
              </p>
            </div>
          </Link>
        }
        resourceNav={
          <nav aria-label="Resources" className={resourceNavGroupClass}>
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={resourcePageHref(link.href, homeHref)}
                className={resourceNavSegmentClass(pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        }
        trailing={<NavLivePill />}
        tabs={
          <nav className={dashboardTabRailClass} aria-label="Dashboard views">
            {mainDashboardTabs.map((tab) => {
              const enabled = enabledDash.has(tab.key);
              const isActive = activeKey === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={!enabled}
                  onClick={() => enabled && setActiveKey(tab.key)}
                  className={dashboardTabClass(isActive, !enabled)}
                >
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="inline sm:hidden">{tab.shortName}</span>
                  {'badge' in tab && tab.badge && (
                    <span className="ml-1 align-middle text-[9px] font-normal opacity-65">({tab.badge})</span>
                  )}
                </button>
              );
            })}
          </nav>
        }
      />

      <main className="relative container mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden px-4 pb-8 pt-[11.75rem] sm:px-6">
        <DashboardHeader config={activeConfig} />

        <div
          key={activeKey}
          className="flex flex-1 flex-col min-h-0 animate-fade-in"
        >
          {renderDashboardBody()}
        </div>

        <footer className="mt-12 pt-8 border-t border-[var(--border-secondary)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--foreground-muted)]">
            <p className="text-[var(--foreground-secondary)]">
              Powered by <span className="font-medium text-[var(--foreground)]">INVNT</span> Event
              Intelligence Engine
            </p>
            {lastUpdated && (
              <p className="tabular-nums text-[var(--foreground-muted)] sm:text-right">
                Last updated {lastUpdated}
              </p>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
