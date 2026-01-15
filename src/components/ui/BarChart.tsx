'use client';

import { useEffect, useState, useRef } from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  orientation?: 'horizontal' | 'vertical';
  showValues?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  maxValue?: number;
  height?: number;
  barThickness?: number;
  className?: string;
  unit?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  data: BarData | null;
}

export function BarChart({
  data,
  orientation = 'horizontal',
  showValues = true,
  showLabels = true,
  showLegend = false,
  animate = true,
  maxValue,
  height = 200,
  barThickness = 12,
  className = '',
  unit = '',
}: BarChartProps) {
  const [animatedData, setAnimatedData] = useState(
    animate ? data.map(d => ({ ...d, value: 0 })) : data
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const max = maxValue || Math.max(...data.map(d => d.value));

  useEffect(() => {
    if (animate) {
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedData(
          data.map(d => ({
            ...d,
            value: d.value * eased,
          }))
        );

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }, [data, animate]);

  const defaultColors = [
    'var(--chart-purple)',
    'var(--chart-violet)',
    'var(--chart-indigo)',
    'var(--chart-blue)',
    'var(--chart-cyan)',
    'var(--chart-teal)',
    'var(--chart-emerald)',
  ];

  const handleMouseMove = (e: React.MouseEvent, item: BarData, index: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        data: { ...item, value: data[index].value },
      });
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
    setHoveredIndex(null);
  };

  const renderTooltip = () => {
    if (!tooltip.visible || !tooltip.data) return null;

    return (
      <div
        className="absolute z-50 pointer-events-none"
        style={{
          left: tooltip.x + 16,
          top: tooltip.y - 8,
          transform: 'translateY(-100%)',
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
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)',
          }}
        >
          <div className="text-xs text-[var(--foreground-muted)]">{tooltip.data.label}</div>
          <div className="text-sm font-bold text-[var(--foreground)] tabular-nums">
            {tooltip.data.value.toLocaleString()}{unit}
          </div>
        </div>
      </div>
    );
  };

  // Calculate fixed row height for horizontal bars
  const rowHeight = showLabels ? barThickness + 28 : barThickness + 12;

  if (orientation === 'horizontal') {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {animatedData.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length];
          const isHovered = hoveredIndex === index;
          
          return (
            <div 
              key={item.label} 
              className="group cursor-pointer"
              style={{ height: rowHeight }}
              onMouseMove={(e) => handleMouseMove(e, item, index)}
              onMouseLeave={handleMouseLeave}
            >
              {showLabels && (
                <div className="flex justify-between text-xs mb-1.5">
                  <span 
                    className="transition-colors duration-200"
                    style={{ color: isHovered ? 'var(--foreground)' : 'var(--foreground-secondary)' }}
                  >
                    {item.label}
                  </span>
                  {showValues && (
                    <span 
                      className="tabular-nums font-medium transition-all duration-200" 
                      style={{ color: isHovered ? color : 'var(--foreground)' }}
                    >
                      {Math.round(item.value).toLocaleString()}{unit}
                    </span>
                  )}
                </div>
              )}
              {/* Fixed height bar container */}
              <div
                className="relative w-full rounded-full"
                style={{
                  height: barThickness,
                  backgroundColor: 'var(--background-tertiary)',
                }}
              >
                {/* Animated fill bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    backgroundColor: color,
                    boxShadow: isHovered 
                      ? `0 0 20px ${color}80, 0 0 40px ${color}40`
                      : `0 0 8px ${color}40`,
                  }}
                >
                  {/* Inner gradient shine */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                    }}
                  />
                </div>
                {/* Shimmer overlay on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full pointer-events-none overflow-hidden"
                    style={{ width: `${(item.value / max) * 100}%` }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        animation: 'shimmer 1.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {renderTooltip()}
        
        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border-secondary)] mt-4">
            {data.map((item, index) => {
              const color = item.color || defaultColors[index % defaultColors.length];
              return (
                <div key={item.label} className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-[var(--foreground-muted)]">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Vertical orientation
  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`} style={{ height }}>
      <div className="flex items-end justify-around gap-2 flex-1 pb-2">
        {animatedData.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length];
          const isHovered = hoveredIndex === index;
          const originalValue = data[index].value;
          
          return (
            <div 
              key={item.label} 
              className="flex flex-col items-center flex-1 cursor-pointer h-full"
              onMouseMove={(e) => handleMouseMove(e, item, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex-1 w-full flex items-end justify-center">
                <div
                  className="relative rounded-t-lg transition-all duration-200"
                  style={{
                    width: barThickness,
                    height: `${(item.value / max) * 100}%`,
                    minHeight: 4,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-t-lg"
                    style={{
                      backgroundColor: color,
                      boxShadow: isHovered 
                        ? `0 0 24px ${color}80, 0 -4px 16px ${color}60`
                        : `0 0 12px ${color}40`,
                      transform: isHovered ? 'scaleX(1.3)' : 'scaleX(1)',
                      transformOrigin: 'center bottom',
                      transition: 'all 0.2s ease-out',
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-30 rounded-t-lg"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="h-10 flex flex-col items-center justify-start pt-2">
                {showValues && (
                  <span 
                    className="text-xs tabular-nums font-medium transition-all duration-200"
                    style={{ color: isHovered ? color : 'var(--foreground)' }}
                  >
                    {Math.round(originalValue).toLocaleString()}
                  </span>
                )}
                {showLabels && (
                  <span 
                    className="text-[10px] text-center truncate max-w-full transition-colors duration-200"
                    style={{ color: isHovered ? 'var(--foreground)' : 'var(--foreground-muted)' }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {renderTooltip()}
      
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-[var(--border-secondary)]">
          {data.map((item, index) => {
            const color = item.color || defaultColors[index % defaultColors.length];
            return (
              <div key={item.label} className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-[var(--foreground-muted)]">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
