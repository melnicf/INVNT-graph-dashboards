'use server';

import { db } from '@/db';
import { dashboards, graphs, clientGraphs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { dashboardDisplayName } from '@/lib/dashboard-display';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== 'super_admin') {
    throw new Error('Unauthorized');
  }
}

async function upsertClientGraphEnabled(
  clientId: string,
  graphId: string,
  enabled: boolean,
) {
  const [existing] = await db
    .select()
    .from(clientGraphs)
    .where(
      and(
        eq(clientGraphs.clientId, clientId),
        eq(clientGraphs.graphId, graphId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(clientGraphs)
      .set({ enabled })
      .where(eq(clientGraphs.id, existing.id));
  } else {
    await db.insert(clientGraphs).values({
      clientId,
      graphId,
      enabled,
      sortOrder: 0,
    });
  }
}

export async function getDashboards() {
  const rows = await db.select().from(dashboards).orderBy(dashboards.key);
  return rows.map((d) => ({
    ...d,
    name: dashboardDisplayName(d.key, d.name),
  }));
}

export async function getGraphs() {
  return db.select().from(graphs).orderBy(graphs.dashboardKey, graphs.key);
}

export async function getClientGraphs(clientId: string) {
  await requireAdmin();
  return db
    .select()
    .from(clientGraphs)
    .where(eq(clientGraphs.clientId, clientId))
    .orderBy(clientGraphs.sortOrder);
}

export async function toggleClientGraph(
  clientId: string,
  graphId: string,
  enabled: boolean,
) {
  await requireAdmin();
  await upsertClientGraphEnabled(clientId, graphId, enabled);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function setClientGraphsEnabled(
  clientId: string,
  graphIds: string[],
  enabled: boolean,
) {
  await requireAdmin();
  for (const graphId of graphIds) {
    await upsertClientGraphEnabled(clientId, graphId, enabled);
  }
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function reorderClientGraphs(
  clientId: string,
  orderedGraphIds: string[],
) {
  await requireAdmin();

  for (let i = 0; i < orderedGraphIds.length; i++) {
    await db
      .update(clientGraphs)
      .set({ sortOrder: i })
      .where(
        and(
          eq(clientGraphs.clientId, clientId),
          eq(clientGraphs.graphId, orderedGraphIds[i]),
        ),
      );
  }

  revalidatePath(`/admin/clients/${clientId}`);
}
