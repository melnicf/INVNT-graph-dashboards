import { DashboardHeader } from '@/components/dashboard';
import { ProductionDashboard } from '@/components/dashboard';

export default function LivePage() {
  return (
    <>
      <DashboardHeader
        config={{
          id: 'production',
          name: 'Live',
          shortName: 'Live',
          description: 'Real-time event monitoring (40" TV setup)',
          chartCount: 8,
        }}
      />
      <div className="flex flex-1 flex-col min-h-0 animate-fade-in">
        <ProductionDashboard />
      </div>
    </>
  );
}
