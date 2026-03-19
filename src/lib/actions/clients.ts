'use server';

import { db } from '@/db';
import { clients, clientDashboards, clientGraphs, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== 'super_admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getClients() {
  await requireAdmin();
  return db.select().from(clients).orderBy(clients.name);
}

export async function getClient(id: string) {
  await requireAdmin();
  const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return client ?? null;
}

export async function createClient(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const logoUrl = (formData.get('logoUrl') as string) || null;

  if (!name) throw new Error('Name is required');

  const slug = slugify(name);

  await db.insert(clients).values({ name, slug, logoUrl });
  revalidatePath('/admin/clients');
}

export async function updateClient(id: string, formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const logoUrl = (formData.get('logoUrl') as string) || null;

  if (!name) throw new Error('Name is required');

  await db
    .update(clients)
    .set({ name, slug: slugify(name), logoUrl })
    .where(eq(clients.id, id));

  revalidatePath('/admin/clients');
  revalidatePath(`/admin/clients/${id}`);
}

export async function deleteClient(id: string) {
  await requireAdmin();

  await db.delete(clientGraphs).where(eq(clientGraphs.clientId, id));
  await db.delete(clientDashboards).where(eq(clientDashboards.clientId, id));
  await db.update(users).set({ clientId: null }).where(eq(users.clientId, id));
  await db.delete(clients).where(eq(clients.id, id));

  revalidatePath('/admin/clients');
}
