'use client';

import { ChartCard } from '@/components/ui';
import { predictiveAnalyticsData } from '@/lib/mock-data';
import { useState, useEffect } from 'react';

const chartConfigs = [
  {
    key: 'temporalFavorability',
    title: 'Temporal & Environmental Favorability',
    subtitle: 'Day, date, weather conditions',
    color: 'var(--chart-purple)',
    type: 'semicircle' as const,
  },
  {
    key: 'locationSuitability',
    title: 'Location, City & Venue Suitability',
    subtitle: 'Accessibility, flow, cost',
    color: 'var(--chart-violet)',
    type: 'ring' as const,
  },
  {
    key: 'contentAlignment',
    title: 'Attendee Content Alignment',
    subtitle: 'Interest vs sessions match',
    color: 'var(--chart-indigo)',
    type: 'progress' as const,
  },
  {
    key: 'economicSentiment',
    title: 'Economic Sentiment & Spend',
    subtitle: 'Financial optimism level',
    color: 'var(--chart-blue)',
    type: 'bars' as const,
  },
  {
    key: 'attendanceReliability',
    title: 'Attendance Reliability',
    subtitle: 'No-show risk level',
    color: 'var(--chart-cyan)',
    type: 'semicircle' as const,
  },
  {
    key: 'networkDensity',
    title: 'Network Density & Potential',
    subtitle: 'Connection probability',
    color: 'var(--chart-teal)',
    type: 'ring' as const,
  },
  {
    key: 'operationalStrain',
    title: 'Operational Strain & Risk',
    subtitle: 'Experience breakdown risk',
    color: 'var(--chart-emerald)',
    type: 'progress' as const,
  },
  {
    key: 'brandStorytelling',
    title: 'Brand Storytelling Effectiveness',
    subtitle: 'Narrative impact score',
    color: 'var(--chart-pink)',
    type: 'bars' as const,
  },
];

// Semi-circle gauge with hover
function SemicircleGauge({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = Math.PI * 60;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div 
      className="flex flex-col items-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg 
        width="160" 
        height="100" 
        viewBox="-10 -10 160 100"
        className="transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
      >
        <defs>
          <filter id={`glow-semi-${color.replace(/[^a-z]/gi, '')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={hovered ? "6" : "4"} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="var(--background-tertiary)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={color}
          strokeWidth={hovered ? "12" : "10"}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#glow-semi-${color.replace(/[^a-z]/gi, '')})`}
          className="transition-all duration-300"
        />
      </svg>
      <div 
        className="flex items-baseline -mt-4 transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
      >
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {animated}
        </span>
        <span className="text-sm text-[var(--foreground-muted)] ml-1">/100</span>
      </div>
    </div>
  );
}

// Ring gauge with hover
function RingGauge({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const size = 100;
  const padding = 15;
  const totalSize = size + padding * 2;
  const strokeWidth = hovered ? 12 : 10;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const center = totalSize / 2;

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg 
        width={totalSize} 
        height={totalSize} 
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        className="transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
      >
        <defs>
          <filter id={`glow-ring-${color.replace(/[^a-z]/gi, '')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={hovered ? "7" : "5"} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--background-tertiary)"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-300"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          filter={`url(#glow-ring-${color.replace(/[^a-z]/gi, '')})`}
          className="transition-all duration-300"
        />
      </svg>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
      >
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>
          {animated}
        </span>
        <span className="text-[10px] text-[var(--foreground-muted)]">/100</span>
      </div>
    </div>
  );
}

// Progress bar with hover
function ProgressBar({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div 
      className="space-y-3 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className="flex justify-between items-baseline transition-transform duration-300"
        style={{ transform: hovered ? 'scale(1.02)' : 'scale(1)' }}
      >
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {animated}
        </span>
        <span className="text-sm text-[var(--foreground-muted)]">/100</span>
      </div>
      <div className="h-3 w-full rounded-full bg-[var(--background-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${animated}%`,
            backgroundColor: color,
            boxShadow: hovered ? `0 0 16px ${color}80` : `0 0 10px ${color}60`,
            transform: hovered ? 'scaleY(1.2)' : 'scaleY(1)',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[var(--foreground-muted)]">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

// Mini bar chart with hover
function MiniBars({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bars = [
    { height: Math.max(20, score - 25) },
    { height: Math.max(20, score - 10) },
    { height: score },
    { height: Math.max(20, score - 15) },
    { height: Math.max(20, score - 30) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-2 h-16">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="w-4 rounded-t cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
            style={{
              height: animated ? `${bar.height}%` : '0%',
              backgroundColor: color,
              opacity: hoveredBar === null ? (i === 2 ? 1 : 0.5 + i * 0.1) : (hoveredBar === i ? 1 : 0.3),
              boxShadow: hoveredBar === i ? `0 0 12px ${color}` : (i === 2 ? `0 0 8px ${color}` : 'none'),
              transform: hoveredBar === i ? 'scaleX(1.3)' : 'scaleX(1)',
              transitionDelay: hoveredBar === null ? `${i * 100}ms` : '0ms',
            }}
          />
        ))}
      </div>
      <div className="flex items-baseline justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-[var(--foreground-muted)] ml-1">/100</span>
      </div>
    </div>
  );
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}

export function PredictiveAnalyticsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {chartConfigs.map((config, index) => {
        const score = predictiveAnalyticsData[config.key as keyof typeof predictiveAnalyticsData];
        
        return (
          <ChartCard
            key={config.key}
            title={config.title}
            subtitle={config.subtitle}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` } as React.CSSProperties}
          >
            <div className="flex flex-col items-center pt-2 pb-1">
              {config.type === 'semicircle' && (
                <SemicircleGauge score={score} color={config.color} />
              )}
              {config.type === 'ring' && (
                <RingGauge score={score} color={config.color} />
              )}
              {config.type === 'progress' && (
                <div className="w-full">
                  <ProgressBar score={score} color={config.color} />
                </div>
              )}
              {config.type === 'bars' && (
                <MiniBars score={score} color={config.color} />
              )}
              
              <div className="mt-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
                  {getScoreLabel(score)}
                </span>
              </div>
            </div>
          </ChartCard>
        );
      })}
    </div>
  );
}
