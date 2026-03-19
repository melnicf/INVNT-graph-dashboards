import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'super_admin') {
    redirect('/');
  }

  return (
    <div className="h-dvh overflow-hidden">
      <AdminSidebar user={session.user} />
      <main className="ml-56 flex h-full min-w-0 flex-col">
        <div className="mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
