'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.TooltipProvider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPortal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[100] max-w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-lg px-3 py-2 text-sm',
        'bg-[var(--background-card)] border border-[var(--border-accent)] shadow-xl backdrop-blur-sm',
        className
      )}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)',
      }}
      {...props}
    />
  </TooltipPortal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal };
