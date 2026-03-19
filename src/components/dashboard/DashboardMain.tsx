'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Main column under fixed `AppNavShell`: top padding clears one or two nav rows (FAQ/Process vs dashboards).
 */
export function DashboardMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasTabRow = pathname !== '/faq' && pathname !== '/process';

  return (
    <main
      className={cn(
        'relative container mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden px-4 pb-8 sm:px-6',
        /* fixed nav + previous py-8 top spacing */
        hasTabRow ? 'pt-[11.75rem]' : 'pt-[7.75rem]',
      )}
    >
      {children}
    </main>
  );
}
