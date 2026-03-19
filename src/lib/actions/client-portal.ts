'use server';

import { db } from '@/db';
import { clients, clientGraphs, dashboards, graphs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { mainDashboardTabs } from '@/lib/nav-config';

export async function getClientPortalData(clientId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) return null;

  const allDashboardRows = await db
    .select({
      key: dashboards.key,
      name: dashboards.name,
      description: dashboards.description,
    })
    .from(dashboards);

  const tabIndex = new Map<string, number>(
    mainDashboardTabs.map((t, i) => [t.key, i]),
  );
  allDashboardRows.sort(
    (a, b) => (tabIndex.get(a.key) ?? 999) - (tabIndex.get(b.key) ?? 999),
  );

  const enabledGraphRows = await db
    .select({
      graphId: clientGraphs.graphId,
      sortOrder: clientGraphs.sortOrder,
      key: graphs.key,
      name: graphs.name,
      dashboardKey: graphs.dashboardKey,
      component: graphs.component,
    })
    .from(clientGraphs)
    .innerJoin(graphs, eq(clientGraphs.graphId, graphs.id))
    .where(
      and(
        eq(clientGraphs.clientId, clientId),
        eq(clientGraphs.enabled, true),
      ),
    )
    .orderBy(clientGraphs.sortOrder);

  return {
    client,
    dashboards: allDashboardRows,
    graphs: enabledGraphRows,
  };
}
