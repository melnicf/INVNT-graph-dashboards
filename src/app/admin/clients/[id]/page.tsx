import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getClient, deleteClient } from '@/lib/actions/clients';
import { getDashboards, getGraphs, getClientGraphs } from '@/lib/actions/dashboard-config';
import { mainDashboardTabs } from '@/lib/nav-config';
import { ClientConfigPanel } from './ClientConfigPanel';
import { EditClientForm } from './EditClientForm';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, allDashboards, allGraphs, enabledGraphs] = await Promise.all([
    getClient(id),
    getDashboards(),
    getGraphs(),
    getClientGraphs(id),
  ]);

  if (!client) notFound();

  const tabIndex = new Map<string, number>(
    mainDashboardTabs.map((t, i) => [t.key, i]),
  );
  const dashboardsOrdered = [...allDashboards].sort(
    (a, b) => (tabIndex.get(a.key) ?? 999) - (tabIndex.get(b.key) ?? 999),
  );

  const enabledGraphIds = new Set(
    enabledGraphs.filter((g) => g.enabled).map((g) => g.graphId),
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <Link href="/admin/clients" className="hover:text-[var(--foreground)] transition-colors">
            Clients
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{client.name}</span>
        </div>
        <a
          href={`/view-client/${client.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors w-fit"
        >
          Open dashboards in new tab
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <EditClientForm client={client} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">Graph configuration</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          All dashboards are available to this client; choose which graphs appear in each.
        </p>

        <ClientConfigPanel
          clientId={client.id}
          dashboards={dashboardsOrdered}
          graphs={allGraphs}
          enabledGraphIds={[...enabledGraphIds]}
        />
      </div>

      {/* Danger zone */}
      <div className="mt-12 pt-8 border-t border-[var(--border-secondary)]">
        <h3 className="text-sm font-medium text-[var(--chart-rose)] mb-2">Danger Zone</h3>
        <form
          action={async () => {
            'use server';
            await deleteClient(id);
            const { redirect } = await import('next/navigation');
            redirect('/admin/clients');
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-[var(--chart-rose)]/30 text-sm text-[var(--chart-rose)] hover:bg-[var(--chart-rose)]/10 transition-colors"
          >
            Delete Client
          </button>
        </form>
      </div>
    </div>
  );
}
