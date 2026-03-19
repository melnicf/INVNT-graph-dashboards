import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getClientPortalData } from '@/lib/actions/client-portal';
import { ClientLandingPage } from '@/components/dashboard';

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (user?.role === 'super_admin') {
    redirect('/admin');
  }

  if (user?.role === 'client' && user.clientId) {
    const portalData = await getClientPortalData(user.clientId);

    if (portalData) {
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
        />
      );
    }
  }

  redirect('/predictive');
}
