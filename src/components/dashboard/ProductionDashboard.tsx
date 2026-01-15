'use client';

import { ChartCard } from '@/components/ui';
import { productionDashboardData } from '@/lib/mock-data';
import { useState, useEffect } from 'react';

// Sparkline with hover interaction
function SparklineChart({ data, color }: { data: { time: string; value: number }[]; color: string }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  
  const width = 400;
  const height = 160;
  const padding = { top: 15, right: 15, bottom: 30, left: 15 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.value - min) / range) * chartH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sparkGradProd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={hoveredPoint !== null ? "0.6" : "0.5"} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <path
        d={areaD}
        fill="url(#sparkGradProd)"
        opacity={animated ? 1 : 0}
        className="transition-opacity duration-500"
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={animated ? 1 : 0}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        className="transition-opacity duration-500"
      />
      
      {/* Vertical hover line */}
      {hoveredPoint !== null && (
        <line
          x1={points[hoveredPoint].x}
          y1={padding.top}
          x2={points[hoveredPoint].x}
          y2={height - padding.bottom}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />
      )}
      
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={hoveredPoint === i ? 8 : 5}
            fill={color}
            opacity={animated ? (hoveredPoint === i ? 1 : hoveredPoint === null ? 1 : 0.3) : 0}
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredPoint(i)}
            onMouseLeave={() => setHoveredPoint(null)}
            style={{ filter: hoveredPoint === i ? `drop-shadow(0 0 8px ${color})` : 'none' }}
          />
          {/* Invisible larger hit area */}
          <circle
            cx={p.x}
            cy={p.y}
            r="15"
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint(i)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        </g>
      ))}
      
      {/* Tooltip */}
      {hoveredPoint !== null && (
        <g>
          <rect
            x={points[hoveredPoint].x - 25}
            y={points[hoveredPoint].y - 35}
            width="50"
            height="24"
            rx="4"
            fill="var(--background-card)"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={points[hoveredPoint].x}
            y={points[hoveredPoint].y - 18}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill={color}
          >
            {data[hoveredPoint].value}s
          </text>
        </g>
      )}
      
      {data.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill={hoveredPoint === i ? color : "var(--foreground-muted)"}
          fontWeight={hoveredPoint === i ? "600" : "400"}
          className="transition-all duration-200"
        >
          {d.time}
        </text>
      ))}
    </svg>
  );
}

// Horizontal bars with hover
function HorizontalBars({ data, unit = '' }: { data: { label: string; value: number; color: string }[]; unit?: string }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2.5">
      {data.map((item, i) => (
        <div 
          key={`${item.label}-${i}`}
          className="cursor-pointer"
          onMouseEnter={() => setHoveredBar(i)}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <div className="flex justify-between text-xs mb-1">
            <span 
              className="truncate max-w-[100px] transition-colors duration-200"
              style={{ color: hoveredBar === i ? item.color : 'var(--foreground-secondary)' }}
            >
              {item.label}
            </span>
            <span 
              className="tabular-nums font-medium flex-shrink-0 ml-2 transition-all duration-200"
              style={{ 
                color: hoveredBar === i ? item.color : 'var(--foreground)',
                transform: hoveredBar === i ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {item.value.toLocaleString()}{unit}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--background-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: animated ? `${(item.value / max) * 100}%` : '0%',
                backgroundColor: item.color,
                boxShadow: hoveredBar === i ? `0 0 12px ${item.color}` : `0 0 8px ${item.color}50`,
                opacity: hoveredBar === null ? 1 : (hoveredBar === i ? 1 : 0.4),
                transitionDelay: hoveredBar === null ? `${i * 0.1}s` : '0s',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Vertical bars with hover
function VerticalBars({ data }: { data: { label: string; value: number; color: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 260;
  const height = 160;
  const barWidth = 28;
  const gap = (width - data.length * barWidth) / (data.length + 1);
  const chartHeight = height - 36;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((item, i) => {
        const barHeight = (item.value / max) * (chartHeight - 10);
        const x = gap + i * (barWidth + gap);
        const y = chartHeight - barHeight;
        const isHovered = hoveredBar === i;
        
        return (
          <g 
            key={i}
            onMouseEnter={() => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
            className="cursor-pointer"
          >
            {/* Tooltip */}
            {isHovered && (
              <g>
                <rect
                  x={x + barWidth / 2 - 25}
                  y={y - 28}
                  width="50"
                  height="22"
                  rx="4"
                  fill="var(--background-card)"
                  stroke={item.color}
                  strokeWidth="1"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={item.color}
                >
                  {item.value}
                </text>
              </g>
            )}
            <rect
              x={x}
              y={animated ? y : chartHeight - 4}
              width={barWidth}
              height={animated ? barHeight : 4}
              rx="4"
              fill={item.color}
              opacity={hoveredBar === null ? 1 : (isHovered ? 1 : 0.3)}
              style={{
                transition: 'y 0.8s ease-out, height 0.8s ease-out, opacity 0.2s ease-out',
                transitionDelay: hoveredBar === null ? `${i * 0.1}s` : '0s',
                filter: isHovered ? `drop-shadow(0 0 10px ${item.color})` : `drop-shadow(0 0 6px ${item.color}60)`,
              }}
            />
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill={isHovered ? item.color : "var(--foreground-muted)"}
              fontWeight={isHovered ? "600" : "400"}
              className="transition-all duration-200"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut chart with hover
function DonutChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 110;
  const thickness = 14;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const defaultColors = ['var(--chart-emerald)', 'var(--chart-amber)', 'var(--chart-rose)'];
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  let offset = 0;

  return (
    <div className="flex items-center justify-center gap-5">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {data.map((item, i) => {
            const color = item.color || defaultColors[i % defaultColors.length];
            const percent = item.value / total;
            const dashOffset = circumference * (1 - (animated ? percent : 0));
            const rotation = offset * 360;
            offset += percent;
            const isHovered = hoveredSegment === i;
            
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                opacity={hoveredSegment === null ? 1 : (isHovered ? 1 : 0.3)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  filter: isHovered ? `drop-shadow(0 0 8px ${color})` : `drop-shadow(0 0 4px ${color}60)`,
                }}
                onMouseEnter={() => setHoveredSegment(i)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-200" style={{ transform: hoveredSegment !== null ? 'scale(1.05)' : 'scale(1)' }}>
          <span 
            className="text-lg font-bold transition-colors duration-200"
            style={{ color: hoveredSegment !== null ? (data[hoveredSegment].color || defaultColors[hoveredSegment % defaultColors.length]) : 'var(--foreground)' }}
          >
            {hoveredSegment !== null ? `${data[hoveredSegment].value}%` : `${data[0].value}%`}
          </span>
          <span className="text-[10px] text-[var(--foreground-muted)]">
            {hoveredSegment !== null ? data[hoveredSegment].label : 'Positive'}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, i) => {
          const color = item.color || defaultColors[i % defaultColors.length];
          const isHovered = hoveredSegment === i;
          return (
            <div 
              key={i} 
              className="flex items-center gap-2 cursor-pointer transition-transform duration-200"
              style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200" 
                style={{ 
                  backgroundColor: color,
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                  boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                }} 
              />
              <span 
                className="text-xs transition-colors duration-200"
                style={{ color: isHovered ? color : 'var(--foreground-muted)' }}
              >
                {item.label}
              </span>
              <span 
                className="text-xs font-medium tabular-nums ml-auto transition-all duration-200"
                style={{ 
                  color: isHovered ? color : 'var(--foreground)',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Metric cards with hover
function MetricCards({ data }: { data: { time: string; value: number }[] }) {
  const colors = ['var(--chart-purple)', 'var(--chart-violet)', 'var(--chart-indigo)'];
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((d, i) => (
        <div 
          key={d.time}
          className="text-center p-3 rounded-lg bg-[var(--background-tertiary)] cursor-pointer transition-all duration-300"
          style={{
            transform: hoveredCard === i ? 'scale(1.08)' : 'scale(1)',
            boxShadow: hoveredCard === i ? `0 0 20px ${colors[i]}40` : 'none',
            opacity: hoveredCard === null ? 1 : (hoveredCard === i ? 1 : 0.5),
          }}
          onMouseEnter={() => setHoveredCard(i)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <p className="text-[10px] text-[var(--foreground-muted)] mb-1">{d.time}</p>
          <p 
            className="text-lg font-bold tabular-nums transition-transform duration-300"
            style={{ 
              color: colors[i],
              transform: hoveredCard === i ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {d.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProductionDashboard() {
  const data = productionDashboardData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Dwell Time - Sparkline */}
      <ChartCard
        title="Dwell Time"
        subtitle="Measured in seconds"
        className="lg:col-span-2 animate-fade-in"
      >
        <div className="h-[160px]">
          <SparklineChart data={data.dwellTimeSeconds} color="var(--chart-purple)" />
        </div>
      </ChartCard>

      {/* 2. Dwell by Seniority - Horizontal Bars */}
      <ChartCard
        title="Dwell by Seniority"
        subtitle="Average time per level"
        className="lg:col-span-2 animate-fade-in"
        style={{ animationDelay: '0.1s' } as React.CSSProperties}
      >
        <HorizontalBars
          data={data.dwellBySeniority.map(d => ({
            label: d.seniority,
            value: d.value,
            color: d.color!,
          }))}
          unit="s"
        />
      </ChartCard>

      {/* 3. Dwell by Zone - Vertical Bars */}
      <ChartCard
        title="Dwell by Zone"
        subtitle="Time across zones"
        className="animate-fade-in"
        style={{ animationDelay: '0.2s' } as React.CSSProperties}
      >
        <div className="h-[160px] flex items-center justify-center">
          <VerticalBars
            data={data.dwellByZone.map(d => ({
              label: d.zone.replace('Zone ', 'Z'),
              value: d.value,
              color: d.color!,
            }))}
          />
        </div>
      </ChartCard>

      {/* 4. Attendees on Site - Metric Cards */}
      <ChartCard
        title="Attendees on Site"
        subtitle="Daily attendance"
        className="animate-fade-in"
        style={{ animationDelay: '0.3s' } as React.CSSProperties}
      >
        <div className="flex items-center justify-center h-[100px]">
          <MetricCards data={data.attendeesOnSite} />
        </div>
      </ChartCard>

      {/* 5. Declared Interest × Zone - Horizontal Bars */}
      <ChartCard
        title="Interest × Zone"
        subtitle="Minutes per zone"
        className="animate-fade-in"
        style={{ animationDelay: '0.4s' } as React.CSSProperties}
      >
        <HorizontalBars
          data={data.declaredInterestByZone.map(d => ({
            label: d.zone,
            value: d.value,
            color: d.color!,
          }))}
        />
      </ChartCard>

      {/* 6. Declared Interest × Content - Vertical Bars */}
      <ChartCard
        title="Interest × Content"
        subtitle="By category"
        className="animate-fade-in"
        style={{ animationDelay: '0.5s' } as React.CSSProperties}
      >
        <div className="h-[160px] flex items-center justify-center">
          <VerticalBars
            data={data.declaredInterestByContent.map(d => ({
              label: d.label.split(' ')[0],
              value: d.value,
              color: d.color!,
            }))}
          />
        </div>
      </ChartCard>

      {/* 7. Audio × Sentiment - Donut */}
      <ChartCard
        title="Audio × Sentiment"
        subtitle="Real-time analysis"
        className="animate-fade-in"
        style={{ animationDelay: '0.6s' } as React.CSSProperties}
      >
        <div className="flex items-center justify-center h-[130px]">
          <DonutChart data={data.audioSentiment} />
        </div>
      </ChartCard>

      {/* 8. Presenter × Time - Horizontal Bars */}
      <ChartCard
        title="Presenter × Time"
        subtitle="Session duration"
        className="animate-fade-in"
        style={{ animationDelay: '0.7s' } as React.CSSProperties}
      >
        <HorizontalBars
          data={data.presenterTime.map((d, i) => ({
            label: d.time.split(' ')[0],
            value: d.value,
            color: ['var(--chart-purple)', 'var(--chart-violet)', 'var(--chart-indigo)', 'var(--chart-blue)', 'var(--chart-cyan)'][i],
          }))}
          unit=" min"
        />
      </ChartCard>
    </div>
  );
}
