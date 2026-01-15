'use client';

import { useEffect, useState, useMemo } from 'react';

interface DonutData {
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
  animate?: boolean;
  className?: string;
  showTooltip?: boolean;
}

export function DonutChart({
  data,
  size = 160,
  thickness = 20,
  centerLabel,
  centerValue,
  animate = true,
  className = '',
  showTooltip = true,
}: DonutChartProps) {
  const [animationProgress, setAnimationProgress] = useState(animate ? 0 : 1);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Add padding for glow effects
  const glowPadding = 24;
  const svgSize = size + glowPadding * 2;

  useEffect(() => {
    if (animate) {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimationProgress(eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }, [animate]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = svgSize / 2;

  const defaultColors = [
    'var(--chart-purple)',
    'var(--chart-violet)',
    'var(--chart-indigo)',
    'var(--chart-blue)',
    'var(--chart-cyan)',
  ];

  // Calculate segment positions
  const segments = useMemo(() => {
    let cumulativePercent = 0;
    return data.map((item, index) => {
      const percent = item.value / total;
      const startAngle = cumulativePercent * 360;
      cumulativePercent += percent;
      return {
        ...item,
        percent,
        startAngle,
        color: item.color || defaultColors[index % defaultColors.length],
      };
    });
  }, [data, total]);

  const hoveredData = hoveredSegment !== null ? segments[hoveredSegment] : null;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size,
        // Allow glow overflow
        overflow: 'visible',
      }}
    >
      {/* SVG with extra padding for glow */}
      <svg 
        width={svgSize} 
        height={svgSize}
        className="absolute"
        style={{
          left: -glowPadding,
          top: -glowPadding,
          overflow: 'visible',
        }}
      >
        <defs>
          {segments.map((segment, index) => (
            <filter 
              key={index} 
              id={`glow-segment-${index}`} 
              x="-100%" 
              y="-100%" 
              width="300%" 
              height="300%"
            >
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        <g transform={`rotate(-90 ${center} ${center})`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth={thickness}
          />

          {/* Segments */}
          {segments.map((segment, index) => {
            const isHovered = hoveredSegment === index;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference * (1 - segment.percent * animationProgress);

            return (
              <circle
                key={segment.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={isHovered ? thickness + 6 : thickness}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer"
                style={{
                  transform: `rotate(${segment.startAngle}deg)`,
                  transformOrigin: `${center}px ${center}px`,
                  filter: isHovered 
                    ? `drop-shadow(0 0 16px ${segment.color}) drop-shadow(0 0 8px ${segment.color})`
                    : `drop-shadow(0 0 4px ${segment.color}80)`,
                  opacity: hoveredSegment !== null && !isHovered ? 0.4 : 1,
                  transition: 'all 0.25s ease-out',
                }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* Center content - positioned relative to the visual size */}
      <div 
        className="absolute flex flex-col items-center justify-center pointer-events-none"
        style={{
          width: size,
          height: size,
        }}
      >
        {hoveredData ? (
          // Show hovered segment info
          <>
            <span 
              className="text-lg font-bold tabular-nums transition-all duration-200"
              style={{ color: hoveredData.color }}
            >
              {((hoveredData.percent) * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)] text-center px-2 max-w-[80%] truncate">
              {hoveredData.label}
            </span>
          </>
        ) : (
          // Default center content
          <>
            {centerValue !== undefined && (
              <span className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-xs text-[var(--foreground-muted)]">
                {centerLabel}
              </span>
            )}
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredData && (
        <div 
          className="absolute z-50"
          style={{ 
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: 12,
            pointerEvents: 'none',
          }}
        >
          <div
            className="
              px-3 py-2 rounded-lg
              bg-[var(--background-card)] border border-[var(--border-accent)]
              shadow-xl backdrop-blur-sm whitespace-nowrap
              animate-fade-in
            "
            style={{
              boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${hoveredData.color}30`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hoveredData.color }}
              />
              <span className="text-xs text-[var(--foreground)]">{hoveredData.label}</span>
            </div>
            <div className="text-sm font-bold tabular-nums" style={{ color: hoveredData.color }}>
              {hoveredData.value.toLocaleString()} ({((hoveredData.percent) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Legend component for donut charts
interface DonutLegendProps {
  data: DonutData[];
  className?: string;
  interactive?: boolean;
  onHover?: (index: number | null) => void;
  hoveredIndex?: number | null;
}

export function DonutLegend({ 
  data, 
  className = '',
  interactive = true,
  onHover,
  hoveredIndex,
}: DonutLegendProps) {
  const [localHovered, setLocalHovered] = useState<number | null>(null);
  const hovered = hoveredIndex ?? localHovered;

  const defaultColors = [
    'var(--chart-purple)',
    'var(--chart-violet)',
    'var(--chart-indigo)',
    'var(--chart-blue)',
    'var(--chart-cyan)',
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleHover = (index: number | null) => {
    setLocalHovered(index);
    onHover?.(index);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {data.map((item, index) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        const color = item.color || defaultColors[index % defaultColors.length];
        const isHovered = hovered === index;
        const isDimmed = hovered !== null && !isHovered;

        return (
          <div 
            key={item.label} 
            className={`
              flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-lg
              transition-all duration-200
              ${interactive ? 'cursor-pointer hover:bg-[var(--background-tertiary)]' : ''}
              ${isDimmed ? 'opacity-40' : 'opacity-100'}
            `}
            onMouseEnter={() => interactive && handleHover(index)}
            onMouseLeave={() => interactive && handleHover(null)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full transition-transform duration-200"
                style={{ 
                  backgroundColor: color,
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                  boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                }}
              />
              <span 
                className="text-xs transition-colors duration-200"
                style={{ color: isHovered ? 'var(--foreground)' : 'var(--foreground-secondary)' }}
              >
                {item.label}
              </span>
            </div>
            <span 
              className="text-xs tabular-nums font-medium transition-all duration-200"
              style={{ 
                color: isHovered ? color : 'var(--foreground)',
              }}
            >
              {percent}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
