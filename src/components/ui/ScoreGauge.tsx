'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
  color?: string;
  title?: string;
  description?: string;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  size = 'md',
  showLabel = true,
  animate = true,
  color,
  title,
  description,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (animate) {
      const duration = 1500;
      const startTime = performance.now();
      
      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(score * eased));
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    } else {
      setDisplayScore(score);
    }
  }, [score, animate]);

  const percentage = (displayScore / maxScore) * 100;
  
  const getScoreColor = () => {
    if (color) return color;
    if (percentage >= 80) return 'var(--chart-emerald)';
    if (percentage >= 60) return 'var(--chart-purple)';
    if (percentage >= 40) return 'var(--chart-amber)';
    return 'var(--chart-rose)';
  };

  const sizeConfig = {
    sm: { diameter: 80, stroke: 6, fontSize: 'text-lg', innerOffset: 4 },
    md: { diameter: 100, stroke: 8, fontSize: 'text-xl', innerOffset: 6 },
    lg: { diameter: 120, stroke: 10, fontSize: 'text-2xl', innerOffset: 8 },
  };

  const { diameter, stroke, fontSize, innerOffset } = sizeConfig[size];
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor = getScoreColor();
  
  // Extra padding for glow effects
  const glowPadding = 20;
  const svgSize = diameter + glowPadding * 2;
  const center = svgSize / 2;

  return (
    <div 
      className="relative inline-flex flex-col items-center justify-center group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        // Fixed size container prevents layout shift
        width: diameter,
        height: diameter,
      }}
    >
      {/* Main gauge container with overflow visible for glow */}
      <div 
        className="absolute"
        style={{
          width: svgSize,
          height: svgSize,
          left: -glowPadding,
          top: -glowPadding,
          overflow: 'visible',
        }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90"
          style={{ overflow: 'visible' }}
        >
          {/* Outer glow effect on hover */}
          <defs>
            <filter id={`glow-${score}-${size}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth={stroke}
            className="transition-all duration-300"
          />
          
          {/* Inner track (subtle) */}
          <circle
            cx={center}
            cy={center}
            r={radius - innerOffset}
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth={1}
            opacity={0.3}
          />
          
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 ${isHovered ? 16 : 8}px ${scoreColor})`,
            }}
          />

          {/* Animated pulse ring on hover - doesn't affect layout */}
          {isHovered && (
            <circle
              cx={center}
              cy={center}
              r={radius + 8}
              fill="none"
              stroke={scoreColor}
              strokeWidth={2}
              opacity={0.4}
              style={{ 
                transformOrigin: `${center}px ${center}px`,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          )}
        </svg>
      </div>
        
      {/* Center content - positioned relative to the visual diameter */}
      {showLabel && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ width: diameter, height: diameter }}
        >
          <span
            className={`${fontSize} font-bold tabular-nums transition-all duration-300`}
            style={{ 
              color: scoreColor,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {displayScore}
          </span>
          <span className="text-[10px] text-[var(--foreground-muted)]">
            / {maxScore}
          </span>
        </div>
      )}

      {/* Hover tooltip - positioned below the gauge */}
      {isHovered && (title || description) && (
        <div 
          className="absolute z-50 left-1/2 transform -translate-x-1/2 pt-3"
          style={{ 
            top: diameter + 8,
            minWidth: 220,
            pointerEvents: 'none',
          }}
        >
          <div 
            className="
              px-4 py-3 rounded-xl
              bg-[var(--background-card)] border border-[var(--border-accent)]
              shadow-2xl backdrop-blur-xl
              animate-fade-in
            "
            style={{
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px ${scoreColor}20`,
            }}
          >
            {title && (
              <p className="text-xs font-semibold text-[var(--foreground)] mb-1">
                {title}
              </p>
            )}
            {description && (
              <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-2 pt-2 border-t border-[var(--border-secondary)] flex justify-between items-center">
              <span className="text-[10px] text-[var(--foreground-muted)]">Score</span>
              <span 
                className="text-sm font-bold tabular-nums"
                style={{ color: scoreColor }}
              >
                {score}/{maxScore}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
