'use client';

import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showFill?: boolean;
  showDot?: boolean;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 40,
  color = 'var(--chart-purple)',
  fillColor,
  showFill = true,
  showDot = true,
  strokeWidth = 2,
  className = '',
}: SparklineProps) {
  const { pathData, areaPath, lastPoint } = useMemo(() => {
    if (data.length < 2) return { pathData: '', areaPath: '', lastPoint: null };

    const minY = Math.min(...data);
    const maxY = Math.max(...data);
    const range = maxY - minY || 1;
    
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const xScale = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => padding + chartHeight - ((value - minY) / range) * chartHeight;

    const points = data.map((value, i) => ({ x: xScale(i), y: yScale(value) }));
    
    // Smooth curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpx1 = points[i].x + (points[i + 1].x - points[i].x) / 3;
      const cpx2 = points[i].x + 2 * (points[i + 1].x - points[i].x) / 3;
      path += ` C ${cpx1} ${points[i].y}, ${cpx2} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }

    const area = `${path} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return {
      pathData: path,
      areaPath: area,
      lastPoint: points[points.length - 1],
    };
  }, [data, width, height]);

  const gradientId = useMemo(() => `sparkline-${Math.random().toString(36).substr(2, 9)}`, []);
  const fill = fillColor || color;

  if (data.length < 2) return null;

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.3" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      {showFill && (
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
        />
      )}

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}60)` }}
      />

      {/* End dot */}
      {showDot && lastPoint && (
        <>
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={4}
            fill={color}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={6}
            fill={color}
            opacity={0.3}
            className="animate-ping"
          />
        </>
      )}
    </svg>
  );
}

// Mini trend indicator with value
interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  label?: string;
  unit?: string;
  sparklineData?: number[];
  className?: string;
}

export function TrendIndicator({
  value,
  previousValue,
  label,
  unit = '',
  sparklineData,
  className = '',
}: TrendIndicatorProps) {
  const change = value - previousValue;
  const percentChange = previousValue ? ((change / previousValue) * 100).toFixed(1) : '0';
  const isPositive = change >= 0;
  const color = isPositive ? 'var(--chart-emerald)' : 'var(--chart-rose)';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {sparklineData && (
        <Sparkline
          data={sparklineData}
          width={80}
          height={32}
          color={color}
          showDot={true}
          strokeWidth={1.5}
        />
      )}
      <div>
        {label && (
          <div className="text-xs text-[var(--foreground-muted)]">{label}</div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--foreground)] tabular-nums">
            {value.toLocaleString()}{unit}
          </span>
          <span className="text-xs font-medium tabular-nums" style={{ color }}>
            {isPositive ? '+' : ''}{percentChange}%
          </span>
        </div>
      </div>
    </div>
  );
}
