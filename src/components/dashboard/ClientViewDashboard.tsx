'use client';

import { ChartCard } from '@/components/ui';
import { clientViewData } from '@/lib/mock-data';
import { useState, useEffect } from 'react';

// Big number with mini sparkline and hover
function BigMetric({ value, unit, trend }: { value: number; unit: string; trend: number[] }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  
  const points = trend.map((v, i) => ({
    x: 8 + (i / (trend.length - 1)) * 80,
    y: 4 + 28 - ((v - min) / range) * 24,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div 
      className="flex items-center justify-between cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="transition-transform duration-300" style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}>
        <div className="flex items-baseline gap-1">
          <span 
            className="text-4xl font-bold text-[var(--chart-purple)] tabular-nums transition-all duration-300"
            style={{ textShadow: hovered ? '0 0 20px var(--chart-purple)' : 'none' }}
          >
            {value}
          </span>
          <span className="text-lg text-[var(--foreground-muted)]">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
          <span>↑</span>
          <span>+12% vs last event</span>
        </div>
      </div>
      <svg 
        width="96" 
        height="36" 
        viewBox="0 0 96 36" 
        className="flex-shrink-0 transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
      >
        <defs>
          <linearGradient id="miniGradClient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-purple)" stopOpacity={hovered ? "0.5" : "0.3"} />
            <stop offset="100%" stopColor="var(--chart-purple)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${points[points.length - 1].x} 32 L 8 32 Z`}
          fill="url(#miniGradClient)"
          opacity={animated ? 1 : 0}
          className="transition-opacity duration-500"
        />
        <path
          d={pathD}
          fill="none"
          stroke="var(--chart-purple)"
          strokeWidth={hovered ? "3" : "2"}
          strokeLinecap="round"
          opacity={animated ? 1 : 0}
          style={{ filter: hovered ? 'drop-shadow(0 0 6px var(--chart-purple))' : 'none' }}
          className="transition-all duration-300"
        />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={hovered ? "6" : "4"}
          fill="var(--chart-purple)"
          opacity={animated ? 1 : 0}
          style={{ filter: hovered ? 'drop-shadow(0 0 8px var(--chart-purple))' : 'none' }}
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
}

// Horizontal bars with hover
function SeniorityBars({ data }: { data: { seniority: string; value: number; color?: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div 
          key={item.seniority}
          className="cursor-pointer"
          onMouseEnter={() => setHoveredBar(i)}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <div className="flex justify-between text-xs mb-1.5">
            <span 
              className="transition-colors duration-200"
              style={{ color: hoveredBar === i ? item.color : 'var(--foreground-secondary)' }}
            >
              {item.seniority}
            </span>
            <span 
              className="tabular-nums font-medium transition-all duration-200"
              style={{ 
                color: hoveredBar === i ? item.color : 'var(--foreground)',
                transform: hoveredBar === i ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {item.value}K
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[var(--background-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: animated ? `${(item.value / max) * 100}%` : '0%',
                backgroundColor: item.color,
                boxShadow: hoveredBar === i ? `0 0 14px ${item.color}` : `0 0 10px ${item.color}50`,
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

// Donut chart with hover
function ZonePie({ data }: { data: { zone: string; value: number; color?: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const size = 100;
  const thickness = 14;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let offset = 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth={thickness}
          />
          {data.map((item, i) => {
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
                stroke={item.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                opacity={hoveredSegment === null ? 1 : (isHovered ? 1 : 0.3)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : `drop-shadow(0 0 4px ${item.color}60)`,
                }}
                onMouseEnter={() => setHoveredSegment(i)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-200"
          style={{ transform: hoveredSegment !== null ? 'scale(1.05)' : 'scale(1)' }}
        >
          <span 
            className="text-lg font-bold transition-colors duration-200"
            style={{ color: hoveredSegment !== null ? data[hoveredSegment].color : 'var(--foreground)' }}
          >
            {hoveredSegment !== null ? `${data[hoveredSegment].value}M` : '3.6M'}
          </span>
          <span className="text-[10px] text-[var(--foreground-muted)]">
            {hoveredSegment !== null ? data[hoveredSegment].zone : 'Total'}
          </span>
        </div>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((item, i) => {
          const isHovered = hoveredSegment === i;
          return (
            <div 
              key={i} 
              className="flex items-center justify-between gap-2 cursor-pointer transition-transform duration-200"
              style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200" 
                  style={{ 
                    backgroundColor: item.color,
                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: isHovered ? `0 0 8px ${item.color}` : 'none',
                  }} 
                />
                <span 
                  className="text-xs truncate transition-colors duration-200"
                  style={{ color: isHovered ? item.color : 'var(--foreground-secondary)' }}
                >
                  {item.zone}
                </span>
              </div>
              <span 
                className="text-xs font-medium tabular-nums flex-shrink-0 transition-all duration-200"
                style={{ 
                  color: isHovered ? item.color : 'var(--foreground)',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {item.value}M
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Day cards with hover
function DayCards({ data }: { data: { day: string; count: number }[] }) {
  const colors = ['var(--chart-purple)', 'var(--chart-violet)', 'var(--chart-indigo)'];
  const maxCount = Math.max(...data.map(d => d.count));
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((day, i) => {
        const percent = (day.count / maxCount) * 100;
        const isHovered = hoveredCard === i;
        return (
          <div
            key={day.day}
            className="relative p-4 rounded-xl bg-[var(--background-tertiary)] text-center overflow-hidden cursor-pointer transition-all duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered ? `0 0 24px ${colors[i]}40` : 'none',
              opacity: hoveredCard === null ? 1 : (isHovered ? 1 : 0.5),
            }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              className="absolute bottom-0 left-0 right-0 transition-all duration-300"
              style={{ 
                height: `${percent}%`, 
                backgroundColor: colors[i],
                opacity: isHovered ? 0.35 : 0.25,
              }}
            />
            <div className="relative">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">{day.day}</p>
              <p 
                className="text-2xl font-bold tabular-nums transition-all duration-300"
                style={{ 
                  color: colors[i],
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  textShadow: isHovered ? `0 0 16px ${colors[i]}` : 'none',
                }}
              >
                {day.count.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">attendees</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// SVG Horizontal Bars with hover
function InterestBars({ data }: { data: { zone: string; value: number; color?: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value));
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 300;
  const height = 160;
  const barHeight = 16;
  const gap = 10;
  const labelWidth = 60;
  const valueWidth = 50;
  const barMaxWidth = width - labelWidth - valueWidth - 20;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((item, i) => {
        const y = 10 + i * (barHeight + gap);
        const barW = (item.value / max) * barMaxWidth;
        const isHovered = hoveredBar === i;
        
        return (
          <g 
            key={i}
            onMouseEnter={() => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
            className="cursor-pointer"
          >
            <text
              x="0"
              y={y + barHeight / 2 + 4}
              fontSize="11"
              fill={isHovered ? item.color : "var(--foreground-secondary)"}
              className="transition-all duration-200"
            >
              {item.zone}
            </text>
            <rect
              x={labelWidth}
              y={y}
              width={animated ? barW : 0}
              height={barHeight}
              rx="4"
              fill={item.color}
              opacity={hoveredBar === null ? 1 : (isHovered ? 1 : 0.3)}
              style={{
                transition: 'width 0.8s ease-out, opacity 0.2s ease-out',
                transitionDelay: hoveredBar === null ? `${i * 0.1}s` : '0s',
                filter: isHovered ? `drop-shadow(0 0 10px ${item.color})` : `drop-shadow(0 0 6px ${item.color}60)`,
              }}
            />
            <text
              x={width - 5}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize="11"
              fontWeight={isHovered ? "700" : "600"}
              fill={isHovered ? item.color : "var(--foreground)"}
              className="transition-all duration-200"
            >
              {item.value.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ClientViewDashboard() {
  const data = clientViewData;
  const trendData = [10.2, 11.1, 11.8, 12.5, 13.1, 13.6, 14.0, 14.4];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Dwell Time */}
      <ChartCard
        title="Dwell Time"
        subtitle="Measured in hours (cumulative)"
        className="animate-fade-in"
      >
        <BigMetric value={data.dwellTimeHours} unit="K" trend={trendData} />
      </ChartCard>

      {/* 2. Dwell by Seniority */}
      <ChartCard
        title="Dwell by Seniority"
        subtitle="Engagement by role (hours)"
        value="139"
        unit="K"
        className="animate-fade-in"
        style={{ animationDelay: '0.1s' } as React.CSSProperties}
      >
        <SeniorityBars data={data.dwellBySeniority} />
      </ChartCard>

      {/* 3. Dwell by Zone */}
      <ChartCard
        title="Dwell by Zone"
        subtitle="Distribution across zones"
        className="animate-fade-in"
        style={{ animationDelay: '0.2s' } as React.CSSProperties}
      >
        <ZonePie data={data.dwellByZone} />
      </ChartCard>

      {/* 4. Attendees on Site */}
      <ChartCard
        title="Attendees on Site"
        subtitle="Daily attendance"
        className="animate-fade-in"
        style={{ animationDelay: '0.3s' } as React.CSSProperties}
      >
        <DayCards data={data.attendeesOnSite} />
      </ChartCard>

      {/* 5. Declared Interest × Zone */}
      <ChartCard
        title="Declared Interest × Zone"
        subtitle="Interest by zone (minutes)"
        className="animate-fade-in"
        style={{ animationDelay: '0.4s' } as React.CSSProperties}
      >
        <div className="h-[160px]">
          <InterestBars data={data.declaredInterestByZone} />
        </div>
      </ChartCard>
    </div>
  );
}
