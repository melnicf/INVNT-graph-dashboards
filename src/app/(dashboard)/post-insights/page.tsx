import { DashboardHeader } from '@/components/dashboard';
import { ClientViewDashboard } from '@/components/dashboard';

export default function PostInsightsPage() {
  return (
    <>
      <DashboardHeader
        config={{
          id: 'client',
          name: 'Post Insights',
          shortName: 'Post Insights',
          description: 'Post-event analysis and insights',
          chartCount: 6,
        }}
      />
      <div className="flex flex-1 flex-col min-h-0 animate-fade-in">
        <ClientViewDashboard />
      </div>
    </>
  );
}
