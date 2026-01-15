'use client';

import { useState, useMemo } from 'react';

interface HeatMapCell {
  x: string;
  y: string;
  value: number;
}

interface HeatMapGridProps {
  data: HeatMapCell[];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string[];
  minValue?: number;
  maxValue?: number;
  cellSize?: number;
  gap?: number;
  showValues?: boolean;
  animate?: boolean;
  className?: string;
  unit?: string;
}

export function HeatMapGrid({
  data,
  xLabels,
  yLabels,
  colorScale,
  minValue,
  maxValue,
  cellSize = 40,
  gap = 4,
  showValues = true,
  animate = true,
  className = '',
  unit = '',
}: HeatMapGridProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const defaultColorScale = [
    'rgba(139, 92, 246, 0.1)',
    'rgba(139, 92, 246, 0.3)',
    'rgba(139, 92, 246, 0.5)',
    'rgba(139, 92, 246, 0.7)',
    'rgba(139, 92, 246, 0.9)',
  ];

  const colors = colorScale || defaultColorScale;

  const { min, max, dataMap } = useMemo(() => {
    const values = data.map(d => d.value);
    const min = minValue ?? Math.min(...values);
    const max = maxValue ?? Math.max(...values);
    
    const dataMap = new Map<string, number>();
    data.forEach(d => dataMap.set(`${d.x}-${d.y}`, d.value));
    
    return { min, max, dataMap };
  }, [data, minValue, maxValue]);

  const getColor = (value: number) => {
    const normalized = (value - min) / (max - min || 1);
    const index = Math.min(Math.floor(normalized * colors.length), colors.length - 1);
    return colors[index];
  };

  const labelWidth = 60;
  const labelHeight = 24;
  const gridWidth = xLabels.length * (cellSize + gap) - gap;
  const gridHeight = yLabels.length * (cellSize + gap) - gap;

  const handleMouseEnter = (cell: HeatMapCell, e: React.MouseEvent) => {
    setHoveredCell(cell);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const container = (e.currentTarget as HTMLElement).closest('.heatmap-container')?.getBoundingClientRect();
    if (container) {
      setTooltipPos({
        x: rect.left - container.left + cellSize / 2,
        y: rect.top - container.top - 8,
      });
    }
  };

  return (
    <div className={`relative heatmap-container ${className}`}>
      {/* Y-axis labels */}
      <div 
        className="absolute left-0 flex flex-col justify-around"
        style={{ 
          top: labelHeight + gap, 
          height: gridHeight,
          width: labelWidth - gap,
        }}
      >
        {yLabels.map(label => (
          <div 
            key={label}
            className="text-xs text-[var(--foreground-muted)] text-right pr-2 truncate"
            style={{ height: cellSize }}
          >
            <span className="leading-[40px]">{label}</span>
          </div>
        ))}
      </div>

      {/* Main grid area */}
      <div style={{ marginLeft: labelWidth }}>
        {/* X-axis labels */}
        <div 
          className="flex justify-around mb-1"
          style={{ height: labelHeight }}
        >
          {xLabels.map(label => (
            <div 
              key={label}
              className="text-xs text-[var(--foreground-muted)] text-center truncate"
              style={{ width: cellSize }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid cells */}
        <div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${xLabels.length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${yLabels.length}, ${cellSize}px)`,
            gap: gap,
          }}
        >
          {yLabels.map((y, yi) =>
            xLabels.map((x, xi) => {
              const value = dataMap.get(`${x}-${y}`) ?? 0;
              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className="rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: getColor(value),
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isHovered ? `0 0 20px ${getColor(value)}` : 'none',
                    zIndex: isHovered ? 10 : 1,
                    animationDelay: animate ? `${(yi * xLabels.length + xi) * 30}ms` : '0ms',
                  }}
                  onMouseEnter={(e) => handleMouseEnter({ x, y, value }, e)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {showValues && (
                    <span 
                      className="text-[10px] font-medium tabular-nums transition-opacity duration-200"
                      style={{ 
                        color: value > (max - min) / 2 + min ? 'white' : 'var(--foreground-muted)',
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    >
                      {value}
                    </span>
                  )}
                  {/* Shine effect */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltipPos.x + labelWidth,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div
            className="px-3 py-2 rounded-lg bg-[var(--background-card)] border border-[var(--border-accent)] shadow-xl animate-fade-in whitespace-nowrap"
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)' }}
          >
            <div className="text-xs text-[var(--foreground-muted)]">
              {hoveredCell.x} × {hoveredCell.y}
            </div>
            <div className="text-sm font-bold text-[var(--chart-purple)] tabular-nums">
              {hoveredCell.value.toLocaleString()}{unit}
            </div>
          </div>
        </div>
      )}

      {/* Color scale legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-[var(--foreground-muted)]">Low</span>
        <div className="flex gap-0.5">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--foreground-muted)]">High</span>
      </div>
    </div>
  );
}
