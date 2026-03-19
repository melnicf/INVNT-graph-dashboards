'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { safeDashboardReturnPath } from '@/lib/safe-return-path';

/**
 * Brand link target: client portal `/`, super-admin default `/predictive`, or `?return=/view-client/...`.
 */
export function useDashboardHomeHref(): string {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  return useMemo(() => {
    const fromQuery = safeDashboardReturnPath(searchParams.get('return'));
    if (fromQuery) return fromQuery;

    if (status === 'loading') return '/predictive';
    if (session?.user?.role === 'super_admin') return '/predictive';
    return '/';
  }, [searchParams, session?.user?.role, status]);
}
