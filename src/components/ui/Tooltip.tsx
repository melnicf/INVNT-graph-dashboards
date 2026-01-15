'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Keep tooltip within viewport
      x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

      setCoords({ x, y });
    }
  }, [isVisible, position]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`inline-block ${className}`}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[100] pointer-events-none"
          style={{
            left: coords.x,
            top: coords.y,
            opacity: coords.x === 0 && coords.y === 0 ? 0 : 1,
            transition: 'opacity 0.15s ease-out',
          }}
        >
          <div
            className="
              px-3 py-2 rounded-lg
              bg-[var(--background-card)] border border-[var(--border-accent)]
              shadow-xl backdrop-blur-sm
              text-sm text-[var(--foreground)]
              animate-fade-in
            "
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)',
            }}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}

// Floating tooltip that follows cursor
interface FloatingTooltipProps {
  content: ReactNode;
  visible: boolean;
  x: number;
  y: number;
}

export function FloatingTooltip({ content, visible, x, y }: FloatingTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: x + 12,
        top: y - 12,
        transform: 'translateY(-100%)',
      }}
    >
      <div
        className="
          px-3 py-2 rounded-lg
          bg-[var(--background-card)] border border-[var(--border-accent)]
          shadow-xl backdrop-blur-sm
          text-sm text-[var(--foreground)]
        "
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {content}
      </div>
    </div>
  );
}
