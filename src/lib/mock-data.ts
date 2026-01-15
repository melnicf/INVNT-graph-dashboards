import {
  PredictiveAnalyticsData,
  ProductionDashboardData,
  ClientViewData,
} from '@/types/dashboard';

// Sample Predictive Analytics Data (0-100 scores)
export const predictiveAnalyticsData: PredictiveAnalyticsData = {
  temporalFavorability: 82,
  locationSuitability: 91,
  contentAlignment: 68,
  economicSentiment: 75,
  attendanceReliability: 72,
  networkDensity: 85,
  operationalStrain: 94,
  brandStorytelling: 88,
};

// Sample Production Dashboard Data
export const productionDashboardData: ProductionDashboardData = {
  dwellTimeSeconds: [
    { time: '09:00', value: 45 },
    { time: '10:00', value: 72 },
    { time: '11:00', value: 89 },
    { time: '12:00', value: 54 },
    { time: '13:00', value: 67 },
    { time: '14:00', value: 91 },
    { time: '15:00', value: 78 },
    { time: '16:00', value: 65 },
  ],
  dwellBySeniority: [
    { seniority: 'C-Suite', value: 156, color: 'var(--chart-purple)' },
    { seniority: 'VP/Director', value: 132, color: 'var(--chart-violet)' },
    { seniority: 'Manager', value: 98, color: 'var(--chart-indigo)' },
    { seniority: 'Individual', value: 74, color: 'var(--chart-blue)' },
    { seniority: 'Student', value: 45, color: 'var(--chart-cyan)' },
  ],
  dwellByZone: [
    { zone: 'Zone 1', value: 1240, color: 'var(--chart-purple)' },
    { zone: 'Zone 2', value: 890, color: 'var(--chart-violet)' },
    { zone: 'Zone 3', value: 1560, color: 'var(--chart-indigo)' },
    { zone: 'Zone 4', value: 720, color: 'var(--chart-blue)' },
    { zone: 'Zone 5', value: 980, color: 'var(--chart-cyan)' },
  ],
  attendeesOnSite: [
    { time: 'Day 1', value: 9922 },
    { time: 'Day 2', value: 9856 },
    { time: 'Day 3', value: 9955 },
  ],
  declaredInterestByZone: [
    { zone: 'Zone 1', value: 2400, color: 'var(--chart-purple)' },
    { zone: 'Zone 2', value: 1800, color: 'var(--chart-violet)' },
    { zone: 'Zone 3', value: 3200, color: 'var(--chart-indigo)' },
    { zone: 'Zone 4', value: 1400, color: 'var(--chart-blue)' },
    { zone: 'Zone 5', value: 2100, color: 'var(--chart-cyan)' },
  ],
  declaredInterestByContent: [
    { label: 'AI & ML', value: 3200, color: 'var(--chart-purple)' },
    { label: 'Cloud', value: 2800, color: 'var(--chart-violet)' },
    { label: 'Security', value: 2100, color: 'var(--chart-indigo)' },
    { label: 'DevOps', value: 1900, color: 'var(--chart-blue)' },
    { label: 'Data', value: 2400, color: 'var(--chart-cyan)' },
  ],
  audioSentiment: [
    { label: 'Positive', value: 68, color: 'var(--chart-emerald)' },
    { label: 'Neutral', value: 24, color: 'var(--chart-amber)' },
    { label: 'Negative', value: 8, color: 'var(--chart-rose)' },
  ],
  presenterTime: [
    { time: 'Keynote A', value: 45, category: 'Keynote' },
    { time: 'Panel B', value: 32, category: 'Panel' },
    { time: 'Workshop C', value: 28, category: 'Workshop' },
    { time: 'Keynote D', value: 41, category: 'Keynote' },
    { time: 'Demo E', value: 18, category: 'Demo' },
  ],
};

// Sample Client View Data (in thousands for dwell times in hours)
export const clientViewData: ClientViewData = {
  dwellTimeHours: 240, // 240K hours (converted from 14.4M minutes)
  dwellBySeniority: [
    { seniority: 'C-Suite', value: 47, color: 'var(--chart-purple)' },
    { seniority: 'VP/Director', value: 40, color: 'var(--chart-violet)' },
    { seniority: 'Manager', value: 27, color: 'var(--chart-indigo)' },
    { seniority: 'Individual', value: 20, color: 'var(--chart-blue)' },
    { seniority: 'Student', value: 5, color: 'var(--chart-cyan)' },
  ],
  dwellByZone: [
    { zone: 'Zone 1', value: 0.9, color: 'var(--chart-purple)' },
    { zone: 'Zone 2', value: 0.7, color: 'var(--chart-violet)' },
    { zone: 'Zone 3', value: 1.1, color: 'var(--chart-indigo)' },
    { zone: 'Zone 4', value: 0.5, color: 'var(--chart-blue)' },
    { zone: 'Zone 5', value: 0.4, color: 'var(--chart-cyan)' },
  ],
  attendeesOnSite: [
    { day: 'Day 1', count: 9922 },
    { day: 'Day 2', count: 9856 },
    { day: 'Day 3', count: 9955 },
  ],
  declaredInterestByZone: [
    { zone: 'Zone 1', value: 4200, color: 'var(--chart-purple)' },
    { zone: 'Zone 2', value: 3100, color: 'var(--chart-violet)' },
    { zone: 'Zone 3', value: 5600, color: 'var(--chart-indigo)' },
    { zone: 'Zone 4', value: 2400, color: 'var(--chart-blue)' },
    { zone: 'Zone 5', value: 3800, color: 'var(--chart-cyan)' },
  ],
};

// Heat map data for zone x time
export const zoneTimeHeatMap = [
  // Zone 1
  { x: '9AM', y: 'Zone 1', value: 45 },
  { x: '10AM', y: 'Zone 1', value: 78 },
  { x: '11AM', y: 'Zone 1', value: 92 },
  { x: '12PM', y: 'Zone 1', value: 56 },
  { x: '1PM', y: 'Zone 1', value: 34 },
  { x: '2PM', y: 'Zone 1', value: 67 },
  { x: '3PM', y: 'Zone 1', value: 85 },
  { x: '4PM', y: 'Zone 1', value: 72 },
  // Zone 2
  { x: '9AM', y: 'Zone 2', value: 32 },
  { x: '10AM', y: 'Zone 2', value: 56 },
  { x: '11AM', y: 'Zone 2', value: 78 },
  { x: '12PM', y: 'Zone 2', value: 89 },
  { x: '1PM', y: 'Zone 2', value: 92 },
  { x: '2PM', y: 'Zone 2', value: 74 },
  { x: '3PM', y: 'Zone 2', value: 61 },
  { x: '4PM', y: 'Zone 2', value: 48 },
  // Zone 3
  { x: '9AM', y: 'Zone 3', value: 67 },
  { x: '10AM', y: 'Zone 3', value: 89 },
  { x: '11AM', y: 'Zone 3', value: 95 },
  { x: '12PM', y: 'Zone 3', value: 72 },
  { x: '1PM', y: 'Zone 3', value: 58 },
  { x: '2PM', y: 'Zone 3', value: 81 },
  { x: '3PM', y: 'Zone 3', value: 93 },
  { x: '4PM', y: 'Zone 3', value: 87 },
  // Zone 4
  { x: '9AM', y: 'Zone 4', value: 23 },
  { x: '10AM', y: 'Zone 4', value: 45 },
  { x: '11AM', y: 'Zone 4', value: 67 },
  { x: '12PM', y: 'Zone 4', value: 78 },
  { x: '1PM', y: 'Zone 4', value: 85 },
  { x: '2PM', y: 'Zone 4', value: 62 },
  { x: '3PM', y: 'Zone 4', value: 48 },
  { x: '4PM', y: 'Zone 4', value: 35 },
  // Zone 5
  { x: '9AM', y: 'Zone 5', value: 54 },
  { x: '10AM', y: 'Zone 5', value: 72 },
  { x: '11AM', y: 'Zone 5', value: 86 },
  { x: '12PM', y: 'Zone 5', value: 64 },
  { x: '1PM', y: 'Zone 5', value: 47 },
  { x: '2PM', y: 'Zone 5', value: 73 },
  { x: '3PM', y: 'Zone 5', value: 88 },
  { x: '4PM', y: 'Zone 5', value: 79 },
];

// Radial progress data for multi-metric display
export const radialMetrics = [
  { label: 'Engagement', value: 85, color: 'var(--chart-purple)' },
  { label: 'Satisfaction', value: 72, color: 'var(--chart-violet)' },
  { label: 'Conversion', value: 68, color: 'var(--chart-indigo)' },
  { label: 'Retention', value: 91, color: 'var(--chart-cyan)' },
];

// Sparkline trend data
export const trendData = {
  attendees: [8500, 8700, 8900, 9100, 9300, 9500, 9700, 9850, 9922],
  engagement: [65, 68, 72, 70, 75, 78, 82, 85, 88],
  sentiment: [70, 72, 68, 75, 73, 78, 80, 82, 85],
};

// Area chart cumulative data
export const cumulativeAttendance = [
  { x: '9AM', y: 2100 },
  { x: '10AM', y: 4500 },
  { x: '11AM', y: 6800 },
  { x: '12PM', y: 7200 },
  { x: '1PM', y: 7800 },
  { x: '2PM', y: 8900 },
  { x: '3PM', y: 9500 },
  { x: '4PM', y: 9922 },
];
