import { Suspense } from 'react';
import {
  DashboardMain,
  DashboardNav,
  DashboardNavSkeleton,
} from '@/components/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background overflow-x-hidden">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(99, 102, 241, 0.1), transparent),
            radial-gradient(ellipse 60% 40% at 0% 100%, rgba(139, 92, 246, 0.08), transparent)
          `,
        }}
      />

      <Suspense fallback={<DashboardNavSkeleton />}>
        <DashboardNav />
      </Suspense>

      <DashboardMain>{children}</DashboardMain>
    </div>
  );
}
