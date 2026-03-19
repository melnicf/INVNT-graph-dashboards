import Link from 'next/link';
import { getClients } from '@/lib/actions/clients';
import { CreateClientForm } from './CreateClientForm';

export default async function ClientsPage() {
  const allClients = await getClients();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Clients</h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            {allClients.length} client{allClients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
      </div>

      <CreateClientForm />

      {allClients.length === 0 ? (
        <div className="text-center py-16 text-[var(--foreground-muted)] text-sm">
          No clients yet. Create one above.
        </div>
      ) : (
        <div className="grid gap-3 mt-6">
          {allClients.map((client) => (
            <div
              key={client.id}
              className="flex items-stretch rounded-xl border border-[var(--border-secondary)] bg-[var(--background-card)] overflow-hidden hover:border-[var(--border-accent)] transition-colors group"
            >
              <Link
                href={`/admin/clients/${client.id}`}
                className="flex flex-1 items-center gap-3 min-w-0 p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[var(--accent-primary)]">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                    {client.name}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">/{client.slug}</p>
                </div>
              </Link>
              <a
                href={`/view-client/${client.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 border-l border-[var(--border-secondary)] text-xs font-medium text-[var(--accent-primary)] hover:bg-[var(--background-tertiary)] transition-colors flex-shrink-0"
              >
                Dashboards
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
