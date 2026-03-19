'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: 'grid' },
  { href: '/admin/clients', label: 'Clients', icon: 'users' },
  { href: '/admin/registry', label: 'Graph Registry', icon: 'chart' },
];

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
};

interface AdminSidebarProps {
  user: { name: string; email: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-dvh w-56 flex-col overflow-hidden border-r border-[var(--border-secondary)] bg-[var(--background-secondary)]">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[var(--border-secondary)]">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/invnt-logo.jpg" alt="INVNT" width={28} height={28} />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">INVNT</p>
            <p className="text-[10px] text-[var(--foreground-muted)]">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
              }`}
            >
              {icons[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / sign out */}
      <div className="px-3 py-4 border-t border-[var(--border-secondary)]">
        <div className="px-3 mb-3">
          <p className="text-xs font-medium text-[var(--foreground)] truncate">{user.name}</p>
          <p className="text-[10px] text-[var(--foreground-muted)] truncate">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-xs text-[var(--foreground-muted)] hover:text-[var(--chart-rose)] px-3 py-1.5 rounded-md hover:bg-[var(--background-tertiary)] transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
