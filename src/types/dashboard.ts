export type DashboardType = 'predictive' | 'production' | 'client';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  time: string;
  value: number;
  category?: string;
}

export interface ZoneData {
  zone: string;
  value: number;
  color?: string;
}

export interface SeniorityData {
  seniority: string;
  value: number;
  color?: string;
}

// Predictive Analytics Layer Charts
export interface PredictiveAnalyticsData {
  temporalFavorability: number;
  locationSuitability: number;
  contentAlignment: number;
  economicSentiment: number;
  attendanceReliability: number;
  networkDensity: number;
  operationalStrain: number;
  brandStorytelling: number;
}

// Production Dashboard Charts
export interface ProductionDashboardData {
  dwellTimeSeconds: TimeSeriesData[];
  dwellBySeniority: SeniorityData[];
  dwellByZone: ZoneData[];
  attendeesOnSite: TimeSeriesData[];
  declaredInterestByZone: ZoneData[];
  declaredInterestByContent: ChartData[];
  audioSentiment: ChartData[];
  presenterTime: TimeSeriesData[];
}

// Client View Dashboard Charts
export interface ClientViewData {
  dwellTimeHours: number;
  dwellBySeniority: SeniorityData[];
  dwellByZone: ZoneData[];
  attendeesOnSite: { day: string; count: number }[];
  declaredInterestByZone: ZoneData[];
}

export interface DashboardConfig {
  id: DashboardType;
  name: string;
  shortName: string;
  description: string;
  chartCount: number;
}

export const dashboardConfigs: DashboardConfig[] = [
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    shortName: 'Predictive',
    description: 'Pre-event forecasting and risk assessment',
    chartCount: 8,
  },
  {
    id: 'production',
    name: 'Production',
    shortName: 'Production',
    description: 'Real-time event monitoring (40" TV setup)',
    chartCount: 8,
  },
  {
    id: 'client',
    name: 'Client View',
    shortName: 'Client',
    description: 'Mobile-optimized client metrics',
    chartCount: 5,
  },
];
