'use client';

import { useState, useEffect } from 'react';
import { ChartCard } from '@/components/ui';
import {
  sentimentOverview,
  sentimentBySession,
  sentimentOverTime,
  surveyResponseRate,
  surveyRatings,
  npsScore,
  surveyTopThemes,
  attendanceSummary,
  attendanceByDay,
  attendanceByTrack,
  hourlyAttendance,
  attendeesByLevel,
  industryBreakdown,
  purchasingIntent,
  budgetCategories,
  budgetSummary,
  staffPerformance,
  vendorRatings,
} from '@/lib/post-insights-data';

const POST_INSIGHT_SECTION_KEYS = [
  'postSentiment',
  'postSurvey',
  'postAttendance',
  'postJobLeveling',
  'postBudget',
  'postStaffVendor',
] as const;

const NEW_POST_INSIGHT_KEYS = new Set<string>(POST_INSIGHT_SECTION_KEYS);

/** Registry uses semantic keys; older DB rows may use legacy keys — then show full dashboard until toggles use new keys. */
function postInsightSectionVisible(
  allowedGraphKeys: ReadonlySet<string> | undefined,
  sectionKey: (typeof POST_INSIGHT_SECTION_KEYS)[number],
): boolean {
  if (allowedGraphKeys === undefined) return true;
  if (allowedGraphKeys.size === 0) return false;
  const usesNew = [...allowedGraphKeys].some((k) => NEW_POST_INSIGHT_KEYS.has(k));
  if (!usesNew) return true;
  return allowedGraphKeys.has(sectionKey);
}

// ── Shared chart primitives ─────────────────────────────────────────────────

function HBar({ items, unit = '' }: { items: { label: string; value: number; color: string }[]; unit?: string }) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...items.map((d) => d.value));
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--foreground-secondary)] truncate max-w-[140px]">{item.label}</span>
            <span className="tabular-nums font-medium text-[var(--foreground)]">{item.value.toLocaleString()}{unit}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--background-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: animated ? `${(item.value / max) * 100}%` : '0%',
                backgroundColor: item.color,
                boxShadow: `0 0 8px ${item.color}50`,
                transitionDelay: `${i * 0.08}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniDonut({ segments, centerLabel, centerValue }: {
  segments: { value: number; color: string; label: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const [animated, setAnimated] = useState(false);
  const total = segments.reduce((s, d) => s + d.value, 0);
  const size = 110;
  const thickness = 14;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = circ * (1 - (animated ? pct : 0));
            const rot = offset * 360;
            offset += pct;
            return (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color}
                strokeWidth={thickness} strokeDasharray={circ} strokeDashoffset={dash}
                className="transition-all duration-700" style={{ transform: `rotate(${rot}deg)`, transformOrigin: 'center', filter: `drop-shadow(0 0 4px ${seg.color}60)` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[var(--foreground)]">{centerValue}</span>
          <span className="text-[10px] text-[var(--foreground-muted)]">{centerLabel}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-[var(--foreground-secondary)]">{seg.label}</span>
            <span className="text-xs font-medium tabular-nums text-[var(--foreground)] ml-auto">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-lg bg-[var(--background-tertiary)] p-3.5 text-center">
      <p className="text-[10px] text-[var(--foreground-muted)] mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < full ? 'var(--chart-amber)' : (i === full && half ? 'var(--chart-amber)' : 'var(--background-tertiary)')} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      ))}
      <span className="text-xs font-medium tabular-nums text-[var(--foreground)] ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function SparkArea({ data, color }: { data: { time: string; value: number }[]; color: string }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 400, h = 120, px = 15, py = 10;
  const cw = w - px * 2, ch = h - py - 24;
  const pts = data.map((d, i) => ({ x: px + (i / (data.length - 1)) * cw, y: py + ch - ((d.value - min) / range) * ch }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1].x} ${h - 24} L ${px} ${h - 24} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`areaG-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" /><stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#areaG-${color.replace(/[^a-z]/gi, '')})`} opacity={animated ? 1 : 0} className="transition-opacity duration-500" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={animated ? 1 : 0} style={{ filter: `drop-shadow(0 0 4px ${color})` }} className="transition-opacity duration-500" />
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--foreground-muted)">{d.time}</text>
      ))}
    </svg>
  );
}

// ── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 mt-10 first:mt-0">
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-xs text-[var(--foreground-muted)]">{subtitle}</p>
    </div>
  );
}

// ── Budget: actual bar + planned marker (single scale per row) ─────────────

function BudgetPlanVsActualRow({
  category,
  budget,
  actual,
}: {
  category: string;
  budget: number;
  actual: number;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const span = Math.max(budget, actual) * 1.12;
  const budgetPct = (budget / span) * 100;
  const actualPct = (actual / span) * 100;
  const isOver = actual > budget;
  const variancePct = ((actual - budget) / budget) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-3 text-xs">
        <span className="min-w-0 font-medium text-[var(--foreground-secondary)]">{category}</span>
        <div className="shrink-0 text-right">
          <p className="tabular-nums text-[var(--foreground)]">
            ${(actual / 1000).toFixed(0)}K
            <span className="mx-1 text-[var(--foreground-muted)]">/</span>
            <span className="text-[var(--foreground-muted)]">${(budget / 1000).toFixed(0)}K</span>
            <span className="text-[10px] text-[var(--foreground-muted)]"> planned</span>
          </p>
          <p
            className={`text-[10px] font-medium tabular-nums ${isOver ? 'text-[var(--chart-rose)]' : 'text-[var(--chart-emerald)]'}`}
          >
            {isOver ? '+' : ''}
            {variancePct.toFixed(1)}% vs plan
          </p>
        </div>
      </div>
      <div className="relative h-3.5 overflow-hidden rounded-md bg-[var(--background-tertiary)]">
        <div
          className={`absolute inset-y-0 left-0 rounded-md transition-[width] duration-700 ease-out ${
            isOver ? 'bg-[var(--chart-rose)]/85' : 'bg-[var(--chart-emerald)]/85'
          }`}
          style={{ width: animated ? `${actualPct}%` : '0%' }}
        />
        <div
          className="absolute top-0 bottom-0 z-[1] w-px bg-[var(--chart-violet)] shadow-[0_0_10px_rgba(139,92,246,0.65)]"
          style={{
            left: animated ? `${budgetPct}%` : '0%',
            transform: 'translateX(-50%)',
            transition: 'left 700ms ease-out',
          }}
          title={`Planned ${(budget / 1000).toFixed(0)}K`}
        />
      </div>
    </div>
  );
}

// ── Main dashboard ──────────────────────────────────────────────────────────

export function ClientViewDashboard(props?: {
  allowedGraphKeys?: ReadonlySet<string>;
}) {
  const { allowedGraphKeys } = props ?? {};
  const vis = (k: (typeof POST_INSIGHT_SECTION_KEYS)[number]) =>
    postInsightSectionVisible(allowedGraphKeys, k);

  const anySection = POST_INSIGHT_SECTION_KEYS.some((k) => vis(k));

  if (allowedGraphKeys !== undefined && (allowedGraphKeys.size === 0 || !anySection)) {
    return (
      <div className="flex w-full flex-1 min-h-0 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] px-6 py-16 text-center text-sm text-[var(--foreground-muted)]">
          No charts are enabled for this view.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* ── 1. Sentiment Analysis ── */}
      {vis('postSentiment') && (
        <>
      <SectionHeader title="Sentiment Analysis" subtitle="Event sentiment data from audio, surveys, and social channels" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Overall Sentiment" subtitle="Across all sessions" className="animate-fade-in">
          <MiniDonut
            segments={[
              { value: sentimentOverview.positive, color: 'var(--chart-emerald)', label: 'Positive' },
              { value: sentimentOverview.neutral, color: 'var(--chart-amber)', label: 'Neutral' },
              { value: sentimentOverview.negative, color: 'var(--chart-rose)', label: 'Negative' },
            ]}
            centerValue={`${sentimentOverview.positive}%`}
            centerLabel="Positive"
          />
        </ChartCard>
        <ChartCard title="Sentiment Trend" subtitle="Score over event duration" className="animate-fade-in" style={{ animationDelay: '0.08s' } as React.CSSProperties}>
          <SparkArea data={sentimentOverTime} color="var(--chart-emerald)" />
        </ChartCard>
        <ChartCard title="Sentiment by Session" subtitle="Top sessions breakdown" className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.16s' } as React.CSSProperties}>
          <HBar items={sentimentBySession.map((s) => ({ label: s.session, value: s.positive, color: 'var(--chart-emerald)' }))} unit="%" />
        </ChartCard>
      </div>
        </>
      )}

      {/* ── 2. Survey Analysis ── */}
      {vis('postSurvey') && (
        <>
      <SectionHeader title="Survey Analysis" subtitle="Post-event survey responses and insights" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Response Rate" value={`${surveyResponseRate}%`} sub="of attendees" color="var(--chart-purple)" />
        <StatCard label="NPS Score" value={`${npsScore}`} sub="out of 100" color="var(--chart-emerald)" />
        <StatCard label="Avg Rating" value="4.3" sub="out of 5.0" color="var(--chart-amber)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Category Ratings" subtitle="Average scores by area" className="animate-fade-in">
          <div className="space-y-3">
            {surveyRatings.map((r) => (
              <div key={r.category} className="flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-secondary)]">{r.category}</span>
                <StarRating rating={r.rating} />
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Top Themes" subtitle="Most mentioned in open responses" className="animate-fade-in" style={{ animationDelay: '0.08s' } as React.CSSProperties}>
          <HBar items={surveyTopThemes.map((t) => ({ label: t.theme, value: t.mentions, color: 'var(--chart-violet)' }))} />
        </ChartCard>
      </div>
        </>
      )}

      {/* ── 3. Attendance Analysis ── */}
      {vis('postAttendance') && (
        <>
      <SectionHeader title="Attendance Analysis" subtitle="Attendance patterns and venue metrics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Registered" value={attendanceSummary.registered.toLocaleString()} color="var(--chart-violet)" />
        <StatCard label="Attended" value={attendanceSummary.attended.toLocaleString()} color="var(--chart-purple)" />
        <StatCard label="Show Rate" value={`${attendanceSummary.showRate}%`} color="var(--chart-emerald)" />
        <StatCard label="Peak Concurrent" value={attendanceSummary.peakConcurrent.toLocaleString()} color="var(--chart-cyan)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Hourly Attendance" subtitle="Attendees on-site over time" className="animate-fade-in">
          <SparkArea data={hourlyAttendance} color="var(--chart-purple)" />
        </ChartCard>
        <ChartCard title="Attendance by Track" subtitle="Distribution across tracks" className="animate-fade-in" style={{ animationDelay: '0.08s' } as React.CSSProperties}>
          <HBar items={attendanceByTrack.map((t) => ({ label: t.track, value: t.value, color: t.color }))} />
        </ChartCard>
      </div>
      <ChartCard title="Daily Breakdown" subtitle="Registration vs actual attendance" className="animate-fade-in mt-4">
        <div className="grid grid-cols-3 gap-3">
          {attendanceByDay.map((d) => (
            <div key={d.day} className="rounded-lg bg-[var(--background-tertiary)] p-3 text-center">
              <p className="text-[10px] text-[var(--foreground-muted)] mb-1">{d.day}</p>
              <p className="text-lg font-bold tabular-nums text-[var(--chart-purple)]">{d.attended.toLocaleString()}</p>
              <p className="text-[10px] text-[var(--chart-emerald)]">{d.showRate}% show rate</p>
            </div>
          ))}
        </div>
      </ChartCard>
        </>
      )}

      {/* ── 4. Job Leveling & Purchasing Power ── */}
      {vis('postJobLeveling') && (
        <>
      <SectionHeader title="Job Leveling & Purchasing Power" subtitle="Attendee demographics and purchasing insights" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Attendees by Level" subtitle="Count and average spend" className="animate-fade-in">
          <div className="space-y-3">
            {attendeesByLevel.map((l) => (
              <div key={l.level} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-[var(--foreground-secondary)] truncate">{l.level}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs tabular-nums text-[var(--foreground-muted)]">{l.count.toLocaleString()}</span>
                  <span className="text-xs tabular-nums font-medium text-[var(--foreground)]">${l.avgSpend.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Industry Breakdown" subtitle="Attendee industries" className="animate-fade-in" style={{ animationDelay: '0.08s' } as React.CSSProperties}>
          <MiniDonut
            segments={industryBreakdown.map((i) => ({ value: i.value, color: i.color, label: i.industry }))}
            centerValue={`${industryBreakdown[0].value}%`}
            centerLabel={industryBreakdown[0].industry}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <StatCard label="High Intent" value={`${purchasingIntent.highIntent}%`} sub="ready to buy" color="var(--chart-emerald)" />
        <StatCard label="Medium Intent" value={`${purchasingIntent.mediumIntent}%`} sub="exploring" color="var(--chart-amber)" />
        <StatCard label="Low Intent" value={`${purchasingIntent.lowIntent}%`} sub="info gathering" color="var(--chart-rose)" />
      </div>
        </>
      )}

      {/* ── 5. Budget vs Actual ── */}
      {vis('postBudget') && (
        <>
      <SectionHeader title="Budget vs Actual Analysis" subtitle="Budget comparisons with actual spend" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Budget" value={`$${(budgetSummary.totalBudget / 1000).toFixed(0)}K`} color="var(--chart-violet)" />
        <StatCard label="Total Actual" value={`$${(budgetSummary.totalActual / 1000).toFixed(0)}K`} color="var(--chart-purple)" />
        <StatCard label="Variance" value={`${budgetSummary.variance}%`} sub="under budget" color="var(--chart-emerald)" />
      </div>
      <ChartCard
        title="Spend vs plan by category"
        subtitle="Bar = actual spend; violet line = planned budget"
        className="animate-fade-in"
      >
        <div className="space-y-5">
          {budgetCategories.map((c) => (
            <BudgetPlanVsActualRow key={c.category} {...c} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border-secondary)] pt-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-1 rounded-sm bg-[var(--chart-violet)] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <span className="text-[10px] text-[var(--foreground-muted)]">Planned budget</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-sm bg-[var(--chart-emerald)]/85" />
            <span className="text-[10px] text-[var(--foreground-muted)]">At or under plan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-sm bg-[var(--chart-rose)]/85" />
            <span className="text-[10px] text-[var(--foreground-muted)]">Over plan</span>
          </div>
        </div>
      </ChartCard>
        </>
      )}

      {/* ── 6. Staff & Vendor Performance ── */}
      {vis('postStaffVendor') && (
        <>
      <SectionHeader title="Staff & Vendor Performance" subtitle="Performance metrics for staff and vendors" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Staff Performance" subtitle="Team ratings and efficiency" className="animate-fade-in">
          <div className="space-y-3">
            {staffPerformance.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-secondary)] truncate max-w-[130px]">{s.name}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] tabular-nums text-[var(--foreground-muted)]">{s.tasksCompleted}%</span>
                  <span className="text-[10px] tabular-nums text-[var(--foreground-muted)]">{s.responseTime}</span>
                  <StarRating rating={s.rating} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Vendor Ratings" subtitle="On-time delivery and quality" className="animate-fade-in" style={{ animationDelay: '0.08s' } as React.CSSProperties}>
          <div className="space-y-3">
            {vendorRatings.map((v) => (
              <div key={v.vendor} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                  <span className="text-xs text-[var(--foreground-secondary)] truncate">{v.vendor}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] tabular-nums text-[var(--chart-emerald)]">{v.onTime}% on-time</span>
                  <StarRating rating={v.rating} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
        </>
      )}
    </div>
  );
}
