'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

interface DataPoint {
  x: string | number;
  y: number;
}

interface AreaChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  showDots?: boolean;
  animate?: boolean;
  className?: string;
  unit?: string;
  smooth?: boolean;
}

export function AreaChart({
  data,
  width = 400,
  height = 200,
  color = 'var(--chart-purple)',
  gradientFrom,
  gradientTo,
  showGrid = true,
  showLabels = true,
  showDots = false,
  animate = true,
  className = '',
  unit = '',
  smooth = true,
}: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(!animate);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const padding = { top: 20, right: 20, bottom: showLabels ? 30 : 10, left: showLabels ? 40 : 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.y);
  const minY = Math.min(...values) * 0.9;
  const maxY = Math.max(...values) * 1.1;

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;

  // Smooth path using cardinal spline
  const pathData = useMemo(() => {
    if (!smooth || data.length < 3) {
      return data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(point.y)}`).join(' ');
    }
    
    let path = `M ${xScale(0)} ${yScale(data[0].y)}`;
    
    for (let i = 0; i < data.length - 1; i++) {
      const x0 = xScale(i);
      const y0 = yScale(data[i].y);
      const x1 = xScale(i + 1);
      const y1 = yScale(data[i + 1].y);
      
      const cpx1 = x0 + (x1 - x0) / 3;
      const cpx2 = x0 + 2 * (x1 - x0) / 3;
      
      path += ` C ${cpx1} ${y0}, ${cpx2} ${y1}, ${x1} ${y1}`;
    }
    
    return path;
  }, [data, chartWidth, chartHeight, minY, maxY, smooth]);

  const areaPath = `${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  useEffect(() => {
    if (animate) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [animate]);

  const gradientId = useMemo(() => `area-gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const fromColor = gradientFrom || color;
  const toColor = gradientTo || 'transparent';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - padding.left;
    
    const pointWidth = chartWidth / (data.length - 1);
    const index = Math.round(x / pointWidth);
    setHoveredPoint(Math.max(0, Math.min(data.length - 1, index)));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={`${className} cursor-crosshair`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.6" />
            <stop offset="50%" stopColor={fromColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid */}
          {showGrid && (
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={0}
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                  stroke="var(--border-secondary)"
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              ))}
            </g>
          )}

          {/* Y-axis labels */}
          {showLabels && (
            <g>
              {[0, 0.5, 1].map((ratio, i) => {
                const value = maxY - ratio * (maxY - minY);
                return (
                  <text
                    key={i}
                    x={-8}
                    y={chartHeight * ratio}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontSize="10"
                    fill="var(--foreground-muted)"
                  >
                    {Math.round(value)}
                  </text>
                );
              })}
            </g>
          )}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 0.8s ease-out' }}
          />

          {/* Hover vertical line */}
          {hoveredPoint !== null && (
            <line
              x1={xScale(hoveredPoint)}
              y1={0}
              x2={xScale(hoveredPoint)}
              y2={chartHeight}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.6}
            />
          )}

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isVisible ? 1 : 0}
            style={{
              transition: 'opacity 0.5s ease-out',
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />

          {/* Dots */}
          {showDots && data.map((point, i) => {
            const isHovered = hoveredPoint === i;
            return (
              <circle
                key={i}
                cx={xScale(i)}
                cy={yScale(point.y)}
                r={isHovered ? 5 : 3}
                fill={isHovered ? color : 'var(--background-card)'}
                stroke={color}
                strokeWidth={2}
                opacity={isVisible ? 1 : 0}
                style={{ transition: 'all 0.2s ease-out' }}
              />
            );
          })}

          {/* X-axis labels */}
          {showLabels && (
            <g>
              {data.map((point, i) => (
                <text
                  key={i}
                  x={xScale(i)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill={hoveredPoint === i ? 'var(--foreground)' : 'var(--foreground-muted)'}
                  fontWeight={hoveredPoint === i ? 600 : 400}
                >
                  {point.x}
                </text>
              ))}
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: padding.left + xScale(hoveredPoint) + 12,
            top: padding.top + yScale(data[hoveredPoint].y) - 40,
          }}
        >
          <div
            className="px-3 py-2 rounded-lg bg-[var(--background-card)] border border-[var(--border-accent)] shadow-xl animate-fade-in"
            style={{ boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${color}30` }}
          >
            <div className="text-xs text-[var(--foreground-muted)]">{data[hoveredPoint].x}</div>
            <div className="text-sm font-bold tabular-nums" style={{ color }}>
              {data[hoveredPoint].y.toLocaleString()}{unit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
