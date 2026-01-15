'use client';

import { useEffect, useState } from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: string;
  color?: string;
  animate?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  suffix,
  prefix,
  trend,
  trendValue,
  icon,
  color = 'var(--chart-purple)',
  animate = true,
  className = '',
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(
    animate && typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (animate && typeof value === 'number') {
      const numValue = value as number;
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Determine if we should show decimals
        const hasDecimals = numValue % 1 !== 0;
        const current = hasDecimals 
          ? parseFloat((numValue * eased).toFixed(1))
          : Math.round(numValue * eased);
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }, [value, animate]);

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

  const formattedValue = typeof displayValue === 'number' 
    ? displayValue.toLocaleString()
    : displayValue;

  return (
    <div
      className={`
        relative p-4 rounded-xl overflow-hidden
        bg-[var(--background-card)] border border-[var(--border-secondary)]
        hover:border-[var(--border-accent)] transition-all duration-300
        ${className}
      `}
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        {/* Icon and label */}
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
            {label}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className="text-lg text-[var(--foreground-secondary)]">
              {prefix}
            </span>
          )}
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {formattedValue}
          </span>
          {suffix && (
            <span className="text-sm text-[var(--foreground-secondary)]">
              {suffix}
            </span>
          )}
        </div>

        {/* Trend */}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendColors[trend]}`}>
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
