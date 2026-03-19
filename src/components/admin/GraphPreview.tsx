'use client';

import { useState } from 'react';
import { predictiveAnalyticsData, productionDashboardData } from '@/lib/mock-data';
import {
  sentimentOverview,
  sentimentOverTime,
  surveyRatings,
  attendanceSummary,
  hourlyAttendance,
  attendeesByLevel,
  budgetCategories,
  staffPerformance,
} from '@/lib/post-insights-data';

// ── Predictive gauge previews ────────────────────────────────────────────────

function ScorePreview({ score, color, type }: { score: number; color: string; type: string }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center py-4">
      {type === 'ring' || type === 'semicircle' ? (
        <div className="relative w-[100px] h-[100px]">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--background-tertiary)" strokeWidth="8" />
            <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>{score}</span>
            <span className="text-[10px] text-[var(--foreground-muted)]">/100</span>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold" style={{ color }}>{score}</span>
            <span className="text-xs text-[var(--foreground-muted)]">/100</span>
          </div>
          <div className="h-3 rounded-full bg-[var(--background-tertiary)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Bar previews ─────────────────────────────────────────────────────────────

function BarsPreview({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2 py-2">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--foreground-secondary)] truncate max-w-[120px]">{item.label}</span>
            <span className="tabular-nums font-medium text-[var(--foreground)]">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--background-tertiary)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}50` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Donut preview ────────────────────────────────────────────────────────────

function DonutPreview({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const size = 90, r = 34, circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="flex items-center gap-4 py-2">
      <svg width={size} height={size} className="-rotate-90 flex-shrink-0">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = circ * (1 - pct);
          const rot = off * 360;
          off += pct;
          return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={dash} style={{ transform: `rotate(${rot}deg)`, transformOrigin: 'center' }} />;
        })}
      </svg>
      <div className="space-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[10px] text-[var(--foreground-secondary)]">{seg.label}</span>
            <span className="text-[10px] font-medium text-[var(--foreground)] ml-auto tabular-nums">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Metric cards preview ─────────────────────────────────────────────────────

function MetricPreview({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      {items.map((m) => (
        <div key={m.label} className="rounded-lg bg-[var(--background-tertiary)] p-2.5 text-center">
          <p className="text-[9px] text-[var(--foreground-muted)] mb-0.5">{m.label}</p>
          <p className="text-sm font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Sparkline preview ────────────────────────────────────────────────────────

function SparkPreview({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 280, h = 80;
  const pts = data.map((d, i) => ({ x: 10 + (i / (data.length - 1)) * (w - 20), y: 8 + (h - 16) - ((d.value - min) / range) * (h - 16) }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1].x} ${h} L 10 ${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="my-2">
      <defs>
        <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#prevGrad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

// ── Star rating preview ──────────────────────────────────────────────────────

function StarsPreview({ items }: { items: { label: string; rating: number }[] }) {
  return (
    <div className="space-y-2 py-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-xs text-[var(--foreground-secondary)]">{item.label}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(item.rating) ? 'var(--chart-amber)' : 'var(--background-tertiary)'} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
              </svg>
            ))}
            <span className="text-[10px] font-medium tabular-nums text-[var(--foreground)] ml-1">{item.rating.toFixed(1)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Chart configs ────────────────────────────────────────────────────────────

const predictiveConfigs: Record<string, { color: string; type: string }> = {
  temporalFavorability: { color: 'var(--chart-purple)', type: 'semicircle' },
  locationSuitability: { color: 'var(--chart-violet)', type: 'ring' },
  contentAlignment: { color: 'var(--chart-indigo)', type: 'progress' },
  attendanceReliability: { color: 'var(--chart-cyan)', type: 'semicircle' },
  networkDensity: { color: 'var(--chart-teal)', type: 'ring' },
  brandStorytelling: { color: 'var(--chart-pink)', type: 'bars' },
};

// ── Main preview resolver ────────────────────────────────────────────────────

function getPreview(dashboardKey: string, graphKey: string): React.ReactNode {
  if (dashboardKey === 'predictive') {
    const cfg = predictiveConfigs[graphKey];
    if (!cfg) return null;
    const score = predictiveAnalyticsData[graphKey as keyof typeof predictiveAnalyticsData];
    return <ScorePreview score={score} color={cfg.color} type={cfg.type} />;
  }

  if (dashboardKey === 'production') {
    const d = productionDashboardData;
    switch (graphKey) {
      case 'dwellTime':
        return <SparkPreview data={d.dwellTimeSeconds.map((p) => ({ label: p.time, value: p.value }))} color="var(--chart-purple)" />;
      case 'dwellBySeniority':
        return <BarsPreview data={d.dwellBySeniority.map((s) => ({ label: s.seniority, value: s.value, color: s.color! }))} />;
      case 'dwellByZone':
        return <BarsPreview data={d.dwellByZone.map((z) => ({ label: z.zone, value: z.value, color: z.color! }))} />;
      case 'attendeesOnSite':
        return <MetricPreview items={d.attendeesOnSite.map((a) => ({ label: a.time, value: a.value.toLocaleString(), color: 'var(--chart-purple)' }))} />;
      case 'interestByZone':
        return <BarsPreview data={d.declaredInterestByZone.map((z) => ({ label: z.zone, value: z.value, color: z.color! }))} />;
      case 'interestByContent':
        return <BarsPreview data={d.declaredInterestByContent.map((c) => ({ label: c.label, value: c.value, color: c.color! }))} />;
      case 'audioSentiment':
        return <DonutPreview segments={d.audioSentiment.map((s) => ({ label: s.label, value: s.value, color: s.color! }))} />;
      case 'presenterTime':
        return <BarsPreview data={d.presenterTime.map((p, i) => ({ label: p.time, value: p.value, color: ['var(--chart-purple)', 'var(--chart-violet)', 'var(--chart-indigo)', 'var(--chart-blue)', 'var(--chart-cyan)'][i] }))} />;
    }
  }

  if (dashboardKey === 'client') {
    switch (graphKey) {
      case 'postSentiment':
        return <DonutPreview segments={[
          { label: 'Positive', value: sentimentOverview.positive, color: 'var(--chart-emerald)' },
          { label: 'Neutral', value: sentimentOverview.neutral, color: 'var(--chart-amber)' },
          { label: 'Negative', value: sentimentOverview.negative, color: 'var(--chart-rose)' },
        ]} />;
      case 'postSurvey':
        return (
          <StarsPreview
            items={surveyRatings.map((s) => ({ label: s.category, rating: s.rating }))}
          />
        );
      case 'postAttendance':
        return <SparkPreview data={hourlyAttendance.map((h) => ({ label: h.time, value: h.value }))} color="var(--chart-purple)" />;
      case 'postJobLeveling':
        return <BarsPreview data={attendeesByLevel.map((l) => ({ label: l.level, value: l.count, color: l.color }))} />;
      case 'postBudget':
        return <BarsPreview data={budgetCategories.slice(0, 4).map((c) => ({ label: c.category, value: c.budget / 1000, color: 'var(--chart-violet)' }))} />;
      case 'postStaffVendor':
        return <BarsPreview data={staffPerformance.slice(0, 4).map((s, i) => ({ label: s.name, value: s.rating * 20, color: ['var(--chart-purple)', 'var(--chart-violet)', 'var(--chart-indigo)', 'var(--chart-cyan)'][i] }))} />;
      case 'dwellTime':
        return <SparkPreview data={hourlyAttendance.map((h) => ({ label: h.time, value: h.value }))} color="var(--chart-purple)" />;
      case 'dwellBySeniority':
        return <BarsPreview data={attendeesByLevel.map((l) => ({ label: l.level, value: l.count, color: l.color }))} />;
      case 'dwellByZone':
        return <DonutPreview segments={[
          { label: 'Positive', value: sentimentOverview.positive, color: 'var(--chart-emerald)' },
          { label: 'Neutral', value: sentimentOverview.neutral, color: 'var(--chart-amber)' },
          { label: 'Negative', value: sentimentOverview.negative, color: 'var(--chart-rose)' },
        ]} />;
      case 'attendeesOnSite':
        return <MetricPreview items={[
          { label: 'Registered', value: attendanceSummary.registered.toLocaleString(), color: 'var(--chart-violet)' },
          { label: 'Attended', value: attendanceSummary.attended.toLocaleString(), color: 'var(--chart-purple)' },
          { label: 'Show Rate', value: `${attendanceSummary.showRate}%`, color: 'var(--chart-emerald)' },
        ]} />;
      case 'interestByZone':
        return (
          <StarsPreview
            items={surveyRatings.map((s) => ({ label: s.category, rating: s.rating }))}
          />
        );
    }
  }

  return null;
}

// ── Preview modal ────────────────────────────────────────────────────────────

interface GraphPreviewModalProps {
  graph: { key: string; name: string; dashboardKey: string } | null;
  onClose: () => void;
}

function GraphPreviewModal({ graph, onClose }: GraphPreviewModalProps) {
  if (!graph) return null;

  const preview = getPreview(graph.dashboardKey, graph.key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--border-secondary)] bg-[var(--background-card)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">{graph.name}</p>
            <p className="text-[10px] text-[var(--foreground-muted)] font-mono">{graph.dashboardKey} / {graph.key}</p>
          </div>
          <button onClick={onClose} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">
          {preview ?? (
            <p className="text-sm text-[var(--foreground-muted)] text-center py-8">No preview available</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Registry with previews ───────────────────────────────────────────────────

interface Graph {
  id: string;
  key: string;
  name: string;
  dashboardKey: string;
  component: string;
}

interface Dashboard {
  id: string;
  key: string;
  name: string;
  description: string | null;
}

interface RegistryWithPreviewProps {
  grouped: { dashboard: Dashboard; graphs: Graph[] }[];
}

export function RegistryWithPreview({ grouped }: RegistryWithPreviewProps) {
  const [previewGraph, setPreviewGraph] = useState<Graph | null>(null);

  return (
    <>
      <div className="space-y-6">
        {grouped.map(({ dashboard, graphs: dGraphs }) => (
          <div
            key={dashboard.id}
            className="rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">{dashboard.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  {dGraphs.length} graphs
                </span>
              </div>
              {dashboard.description && (
                <p className="text-xs text-[var(--foreground-muted)] mt-1">{dashboard.description}</p>
              )}
              <p className="text-[10px] text-[var(--foreground-muted)] mt-1 font-mono">key: {dashboard.key}</p>
            </div>

            <div className="divide-y divide-[var(--border-secondary)]">
              {dGraphs.map((graph) => (
                <div key={graph.id} className="flex items-center justify-between px-5 py-3 group">
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--foreground)]">{graph.name}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] font-mono">
                      {graph.key} &middot; {graph.component}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewGraph(graph)}
                    className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors px-2.5 py-1 rounded-md hover:bg-[var(--accent-primary)]/10 opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </button>
                </div>
              ))}
              {dGraphs.length === 0 && (
                <div className="px-5 py-6 text-center text-sm text-[var(--foreground-muted)]">
                  No graphs registered for this dashboard.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <GraphPreviewModal graph={previewGraph} onClose={() => setPreviewGraph(null)} />
    </>
  );
}
