'use client';

import { useEffect, useState } from 'react';

interface RadialItem {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

interface RadialProgressProps {
  items: RadialItem[];
  size?: number;
  thickness?: number;
  gap?: number;
  animate?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function RadialProgress({
  items,
  size = 200,
  thickness = 12,
  gap = 6,
  animate = true,
  showLabels = true,
  className = '',
}: RadialProgressProps) {
  const [progress, setProgress] = useState(animate ? 0 : 1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (animate) {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const prog = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        setProgress(eased);

        if (prog < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }, [animate]);

  const defaultColors = [
    'var(--chart-purple)',
    'var(--chart-violet)',
    'var(--chart-indigo)',
    'var(--chart-blue)',
    'var(--chart-cyan)',
  ];

  const center = size / 2;
  const totalThickness = items.length * thickness + (items.length - 1) * gap;
  const startRadius = (size - totalThickness) / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          {items.map((_, index) => (
            <filter key={index} id={`radial-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {items.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length];
          const maxValue = item.maxValue || 100;
          const percentage = (item.value / maxValue) * progress;
          const radius = startRadius + index * (thickness + gap);
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference * (1 - percentage);
          const isHovered = hoveredIndex === index;

          return (
            <g key={index} transform={`rotate(-90 ${center} ${center})`}>
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="var(--background-tertiary)"
                strokeWidth={thickness}
              />
              {/* Progress arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: `drop-shadow(0 0 ${isHovered ? 12 : 6}px ${color})`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}

        {/* Center content */}
        {hoveredIndex !== null && (
          <g>
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              fontSize="12"
              fill="var(--foreground-muted)"
            >
              {items[hoveredIndex].label}
            </text>
            <text
              x={center}
              y={center + 12}
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill={items[hoveredIndex].color || defaultColors[hoveredIndex % defaultColors.length]}
            >
              {Math.round(items[hoveredIndex].value)}%
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLabels && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full pt-4">
          <div className="flex flex-wrap justify-center gap-4">
            {items.map((item, index) => {
              const color = item.color || defaultColors[index % defaultColors.length];
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                  style={{ opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-transform duration-200"
                    style={{
                      backgroundColor: color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                      boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                    }}
                  />
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-medium tabular-nums"
                    style={{ color: isHovered ? color : 'var(--foreground)' }}
                  >
                    {Math.round(item.value * progress)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
