import Link from 'next/link';
import { db } from '@/db';
import { clients, dashboards, graphs, users } from '@/db/schema';
import { count } from 'drizzle-orm';

export default async function AdminOverviewPage() {
  const [[clientCount], [dashboardCount], [graphCount], [userCount]] =
    await Promise.all([
      db.select({ value: count() }).from(clients),
      db.select({ value: count() }).from(dashboards),
      db.select({ value: count() }).from(graphs),
      db.select({ value: count() }).from(users),
    ]);

  const stats = [
    { label: 'Clients', value: clientCount.value, href: '/admin/clients', color: 'var(--chart-purple)' },
    { label: 'Dashboards', value: dashboardCount.value, href: '/admin/registry', color: 'var(--chart-violet)' },
    { label: 'Graphs', value: graphCount.value, href: '/admin/registry', color: 'var(--chart-indigo)' },
    { label: 'Users', value: userCount.value, href: '/admin', color: 'var(--chart-cyan)' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Admin Overview</h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-8">
        Manage clients, dashboards, and graph assignments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] p-5 hover:border-[var(--border-accent)] transition-colors"
          >
            <p className="text-xs text-[var(--foreground-muted)] mb-2">{s.label}</p>
            <p className="text-3xl font-bold tabular-nums" style={{ color: s.color }}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/clients"
          className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          Manage Clients
        </Link>
        <Link
          href="/admin/registry"
          className="px-4 py-2 rounded-lg border border-[var(--border-primary)] text-sm font-medium text-[var(--foreground-secondary)] hover:border-[var(--border-accent)] transition-colors"
        >
          View Graph Registry
        </Link>
      </div>
    </div>
  );
}
