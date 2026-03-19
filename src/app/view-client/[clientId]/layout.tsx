import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ViewClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== 'super_admin') {
    redirect('/login');
  }
  return <>{children}</>;
}
