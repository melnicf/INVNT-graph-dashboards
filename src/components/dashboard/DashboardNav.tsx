'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  dashboardTabClass,
  dashboardTabRailClass,
  hrefPreservingReturn,
  mainDashboardTabs,
  resourceNavGroupClass,
  resourceNavSegmentClass,
  secondaryNavLinks,
} from '@/lib/nav-config';
import { useDashboardHomeHref } from '@/hooks/useDashboardHomeHref';
import { AppNavShell } from './AppNavShell';
import { NavLivePill } from './NavLivePill';

const brandLinkClass =
  'group flex min-w-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-[background,box-shadow] duration-200 hover:bg-[var(--background-card)]/55 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:gap-3 sm:pr-3';

const brandImageClass =
  'size-9 shrink-0 rounded-[10px] object-contain ring-1 ring-white/[0.08] transition-[ring-color] duration-200 group-hover:ring-[var(--accent-primary)]/30 sm:size-10';

/** Placeholder bar while search params / session resolve (layout Suspense fallback). */
export function DashboardNavSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[9.75rem] w-full animate-pulse border-b border-[var(--border-secondary)] bg-[var(--background)]/60 backdrop-blur-md sm:h-[10.25rem]" />
  );
}

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brandHomeHref = useDashboardHomeHref();
  const returnParam = searchParams.get('return');
  const showDashboardTabs = pathname !== '/faq' && pathname !== '/process';

  return (
    <AppNavShell
      brand={
        <Link href={brandHomeHref} className={brandLinkClass} title="Back to dashboards">
          <Image
            src="/invnt-logo.jpg"
            alt="INVNT"
            width={40}
            height={40}
            className={brandImageClass}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-[0.9375rem]">
              INVNT
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-muted)] sm:block">
              Intelligence Engine
            </p>
          </div>
        </Link>
      }
      resourceNav={
        <nav aria-label="Resources" className={resourceNavGroupClass}>
          {secondaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={hrefPreservingReturn(link.href, returnParam)}
              className={resourceNavSegmentClass(pathname === link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      }
      trailing={
        <>
          <NavLivePill />
          {session?.user && showDashboardTabs && (
            <div className="hidden items-center gap-0.5 rounded-full border border-[var(--border-primary)]/40 bg-[var(--background-card)]/70 py-1 pl-2.5 pr-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:flex">
              <span className="max-w-[7.5rem] truncate px-1 text-xs font-medium text-[var(--foreground-secondary)]">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80"
                  aria-hidden
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </>
      }
      tabs={
        showDashboardTabs ? (
          <nav className={dashboardTabRailClass} aria-label="Dashboard views">
            {mainDashboardTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={hrefPreservingReturn(tab.href, returnParam)}
                  className={dashboardTabClass(isActive)}
                >
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="inline sm:hidden">{tab.shortName}</span>
                  {'badge' in tab && tab.badge && (
                    <span className="ml-1 align-middle text-[9px] font-normal opacity-65">({tab.badge})</span>
                  )}
                </Link>
              );
            })}
          </nav>
        ) : null
      }
    />
  );
}
