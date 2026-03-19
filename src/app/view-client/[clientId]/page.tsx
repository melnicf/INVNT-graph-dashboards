import { notFound } from 'next/navigation';
import { getClientPortalData } from '@/lib/actions/client-portal';
import { ClientLandingPage } from '@/components/dashboard';

export default async function ViewClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const portalData = await getClientPortalData(clientId);

  if (!portalData) {
    notFound();
  }

  if (portalData.dashboards.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 bg-background">
        <p className="text-sm text-[var(--foreground-secondary)] text-center max-w-md">
          No dashboards are registered yet. Run the database seed or add dashboards in the admin registry.
        </p>
      </div>
    );
  }

  return (
    <ClientLandingPage
      data={{
        client: portalData.client,
        dashboards: portalData.dashboards,
        graphs: portalData.graphs.map((g) => ({
          key: g.key,
          dashboardKey: g.dashboardKey,
        })),
      }}
      homeHref={`/view-client/${clientId}`}
    />
  );
}
