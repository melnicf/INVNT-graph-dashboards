'use client';

import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
}

export function ChartCard({
  title,
  subtitle,
  value,
  unit,
  trend,
  trendValue,
  children,
  className = '',
  loading = false,
  style,
}: ChartCardProps) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-amber-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  if (loading) {
    return (
    <div
      className={`
          relative rounded-xl
          bg-[var(--background-card)] border border-[var(--border-secondary)]
          p-5 ${className}
        `}
    >
        <div className="space-y-3">
          <div className="skeleton h-4 w-2/3 rounded-md" />
          <div className="skeleton h-3 w-1/2 rounded-md" />
        </div>
        <div className="mt-6 skeleton h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div
      className={`
        relative rounded-xl
        bg-[var(--background-card)] border border-[var(--border-secondary)]
        hover:border-[var(--border-accent)]
        transition-all duration-300 ease-out group
        p-5 ${className}
      `}
      style={{
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, var(--background-card) 100%)',
        ...style,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[var(--foreground)] leading-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Value Badge */}
        {value !== undefined && (
          <div className="flex items-baseline gap-1 ml-3 flex-shrink-0">
            <span className="text-xl font-semibold text-[var(--foreground)] tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-xs text-[var(--foreground-muted)]">
                {unit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-xs mb-3 ${trendColors[trend]}`}>
          <span>{trendIcons[trend]}</span>
          <span>{trendValue}</span>
        </div>
      )}

      {/* Chart Content - contained */}
      <div className="w-full">
        {children}
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 blur-3xl pointer-events-none transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
