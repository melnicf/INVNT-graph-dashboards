'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  fillGradient?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  animate?: boolean;
  className?: string;
  unit?: string;
}

export function LineChart({
  data,
  width = 400,
  height = 200,
  color = 'var(--chart-purple)',
  fillGradient = true,
  showDots = true,
  showGrid = true,
  showLabels = true,
  animate = true,
  className = '',
  unit = '',
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isVisible, setIsVisible] = useState(!animate);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const padding = { top: 20, right: 20, bottom: showLabels ? 30 : 10, left: showLabels ? 40 : 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.y);
  const minY = Math.min(...values) * 0.9;
  const maxY = Math.max(...values) * 1.1;

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;

  const pathData = data
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(point.y)}`)
    .join(' ');

  // Smooth curve path using bezier curves
  const smoothPathData = useMemo(() => {
    if (data.length < 2) return pathData;
    
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
  }, [data, chartWidth, chartHeight, minY, maxY]);

  const areaPath = `${smoothPathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  useEffect(() => {
    if (svgRef.current && animate) {
      const path = svgRef.current.querySelector('.chart-line') as SVGPathElement;
      if (path) {
        const length = path.getTotalLength();
        setPathLength(length);
        
        setTimeout(() => setIsVisible(true), 100);
      }
    }
  }, [data, animate]);

  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const glowId = useMemo(() => `glow-${Math.random().toString(36).substr(2, 9)}`, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - padding.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    // Find closest point
    const pointWidth = chartWidth / (data.length - 1);
    const index = Math.round(x / pointWidth);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    setHoveredPoint(clampedIndex);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
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
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {showGrid && (
            <g className="grid">
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
            <g className="y-labels">
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
          {fillGradient && (
            <path
              d={areaPath}
              fill={`url(#${gradientId})`}
              opacity={isVisible ? 1 : 0}
              style={{ transition: 'opacity 0.8s ease-out' }}
            />
          )}

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
            className="chart-line"
            d={smoothPathData}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
            style={{
              strokeDasharray: animate ? pathLength : 'none',
              strokeDashoffset: isVisible ? 0 : pathLength,
              transition: animate ? 'stroke-dashoffset 1.5s ease-out' : 'none',
            }}
          />

          {/* Data points */}
          {showDots && data.map((point, i) => {
            const isHovered = hoveredPoint === i;
            return (
              <g key={i}>
                {/* Outer glow ring */}
                {isHovered && (
                  <circle
                    cx={xScale(i)}
                    cy={yScale(point.y)}
                    r={12}
                    fill={color}
                    opacity={0.2}
                    className="animate-ping"
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={xScale(i)}
                  cy={yScale(point.y)}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? color : 'var(--background-card)'}
                  stroke={color}
                  strokeWidth={2}
                  opacity={isVisible ? 1 : 0}
                  style={{
                    transition: `all 0.2s ease-out, opacity 0.3s ease-out ${i * 0.1}s`,
                    filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
                  }}
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {showLabels && (
            <g className="x-labels">
              {data.map((point, i) => (
                <text
                  key={i}
                  x={xScale(i)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill={hoveredPoint === i ? 'var(--foreground)' : 'var(--foreground-muted)'}
                  fontWeight={hoveredPoint === i ? 600 : 400}
                  style={{ transition: 'all 0.2s ease-out' }}
                >
                  {point.x}
                </text>
              ))}
            </g>
          )}
        </g>
      </svg>

      {/* Floating tooltip */}
      {hoveredPoint !== null && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: padding.left + xScale(hoveredPoint) + 12,
            top: padding.top + yScale(data[hoveredPoint].y) - 40,
          }}
        >
          <div
            className="
              px-3 py-2 rounded-lg
              bg-[var(--background-card)] border border-[var(--border-accent)]
              shadow-xl backdrop-blur-sm
              animate-fade-in
            "
            style={{
              boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${color}30`,
            }}
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
