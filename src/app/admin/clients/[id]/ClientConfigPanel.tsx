'use client';

import { useState, useTransition } from 'react';
import {
  setClientGraphsEnabled,
  toggleClientGraph,
} from '@/lib/actions/dashboard-config';

interface Dashboard {
  id: string;
  key: string;
  name: string;
  description: string | null;
}

interface Graph {
  id: string;
  key: string;
  name: string;
  dashboardKey: string;
  component: string;
}

interface ClientConfigPanelProps {
  clientId: string;
  dashboards: Dashboard[];
  graphs: Graph[];
  enabledGraphIds: string[];
}

export function ClientConfigPanel({
  clientId,
  dashboards,
  graphs,
  enabledGraphIds: initialGraphIds,
}: ClientConfigPanelProps) {
  const [enabledGraphs, setEnabledGraphs] = useState<Set<string>>(
    new Set(initialGraphIds),
  );
  const [, startTransition] = useTransition();

  function handleGraphToggle(graphId: string) {
    const next = !enabledGraphs.has(graphId);
    setEnabledGraphs((prev) => {
      const s = new Set(prev);
      next ? s.add(graphId) : s.delete(graphId);
      return s;
    });
    startTransition(() => {
      toggleClientGraph(clientId, graphId, next);
    });
  }

  function handleDashboardSelectAll(graphIds: string[], enable: boolean) {
    if (graphIds.length === 0) return;
    setEnabledGraphs((prev) => {
      const s = new Set(prev);
      for (const id of graphIds) {
        enable ? s.add(id) : s.delete(id);
      }
      return s;
    });
    startTransition(() => {
      setClientGraphsEnabled(clientId, graphIds, enable);
    });
  }

  const graphsByDashboard = dashboards.map((d) => ({
    dashboard: d,
    graphs: graphs.filter((g) => g.dashboardKey === d.key),
  }));

  return (
    <div className="space-y-6">
      {graphsByDashboard.map(({ dashboard, graphs: dGraphs }) => (
        <div
          key={dashboard.id}
          className="rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-[var(--border-secondary)] flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {dashboard.name}
              </p>
              {dashboard.description && (
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                  {dashboard.description}
                </p>
              )}
            </div>
            {dGraphs.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  handleDashboardSelectAll(
                    dGraphs.map((g) => g.id),
                    !dGraphs.every((g) => enabledGraphs.has(g.id)),
                  )
                }
                className="shrink-0 self-start text-xs font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
              >
                {dGraphs.every((g) => enabledGraphs.has(g.id))
                  ? 'Deselect all'
                  : 'Select all'}
              </button>
            )}
          </div>

          <div className="divide-y divide-[var(--border-secondary)]">
            {dGraphs.map((graph) => (
              <div
                key={graph.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {graph.name}
                  </p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">
                    {graph.key}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleGraphToggle(graph.id)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-out ${
                    enabledGraphs.has(graph.id)
                      ? 'bg-[var(--chart-emerald)]'
                      : 'bg-[var(--background-tertiary)]'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute top-1/2 left-0.5 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                      enabledGraphs.has(graph.id) ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
