import { DashboardHeader } from '@/components/dashboard';
import { PredictiveAnalyticsDashboard } from '@/components/dashboard';

export default function PredictivePage() {
  return (
    <>
      <DashboardHeader
        config={{
          id: 'predictive',
          name: 'Predictive Analytics',
          shortName: 'Predictive',
          description: 'Pre-event forecasting and risk assessment',
          chartCount: 6,
        }}
      />
      <div className="flex flex-1 flex-col min-h-0 animate-fade-in">
        <PredictiveAnalyticsDashboard />
      </div>
    </>
  );
}
