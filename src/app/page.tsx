'use client';

import { useState, useEffect } from 'react';
import { DashboardType, dashboardConfigs } from '@/types/dashboard';
import {
  DashboardNav,
  DashboardHeader,
  PredictiveAnalyticsDashboard,
  ProductionDashboard,
  ClientViewDashboard,
} from '@/components/dashboard';

export default function Home() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('predictive');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [activeDashboard]);

  const activeConfig = dashboardConfigs.find((c) => c.id === activeDashboard)!;

  const renderDashboard = () => {
    switch (activeDashboard) {
      case 'predictive':
        return <PredictiveAnalyticsDashboard />;
      case 'production':
        return <ProductionDashboard />;
      case 'client':
        return <ClientViewDashboard />;
      default:
        return <PredictiveAnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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

      {/* Navigation */}
      <DashboardNav
        activeDashboard={activeDashboard}
        onDashboardChange={setActiveDashboard}
      />

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-8">
        <DashboardHeader config={activeConfig} />

        {/* Dashboard Grid */}
        <div key={activeDashboard} className="animate-fade-in">
          {renderDashboard()}
        </div>

        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-(--border-secondary)">
          <div className="flex items-center justify-between text-xs text-(--foreground-muted)">
            <div className="flex items-center gap-4">
              <span>Real-time data pipeline: Kafka</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected</span>
            </div>
            <div>
              {lastUpdated && <span>Last updated: {lastUpdated}</span>}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
