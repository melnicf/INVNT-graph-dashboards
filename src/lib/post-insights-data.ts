// ── Sentiment Analysis ───────────────────────────────────────────────────────

export const sentimentOverview = {
  positive: 72,
  neutral: 20,
  negative: 8,
};

export const sentimentBySession = [
  { session: 'Opening Keynote', positive: 85, neutral: 12, negative: 3 },
  { session: 'Panel: Future of AI', positive: 78, neutral: 15, negative: 7 },
  { session: 'Workshop: Hands-on ML', positive: 91, neutral: 6, negative: 3 },
  { session: 'Fireside Chat', positive: 68, neutral: 22, negative: 10 },
  { session: 'Closing Ceremony', positive: 82, neutral: 14, negative: 4 },
];

export const sentimentOverTime = [
  { time: 'Day 1 AM', value: 74 },
  { time: 'Day 1 PM', value: 71 },
  { time: 'Day 2 AM', value: 78 },
  { time: 'Day 2 PM', value: 76 },
  { time: 'Day 3 AM', value: 82 },
  { time: 'Day 3 PM', value: 80 },
];

// ── Survey Analysis ─────────────────────────────────────────────────────────

export const surveyResponseRate = 68;

export const surveyRatings = [
  { category: 'Overall Experience', rating: 4.5 },
  { category: 'Content Quality', rating: 4.3 },
  { category: 'Networking', rating: 4.1 },
  { category: 'Venue & Logistics', rating: 4.6 },
  { category: 'Speaker Quality', rating: 4.4 },
  { category: 'Food & Beverage', rating: 3.9 },
];

export const npsScore = 72;

export const surveyTopThemes = [
  { theme: 'Great speakers', mentions: 342 },
  { theme: 'More networking time', mentions: 218 },
  { theme: 'Excellent venue', mentions: 195 },
  { theme: 'Better Wi-Fi needed', mentions: 156 },
  { theme: 'Loved the workshops', mentions: 134 },
];

// ── Attendance Analysis ─────────────────────────────────────────────────────

export const attendanceSummary = {
  registered: 12500,
  attended: 9922,
  showRate: 79.4,
  peakConcurrent: 8750,
};

export const attendanceByDay = [
  { day: 'Day 1', registered: 11200, attended: 9922, showRate: 88.6 },
  { day: 'Day 2', registered: 11200, attended: 9856, showRate: 88.0 },
  { day: 'Day 3', registered: 11200, attended: 9955, showRate: 88.9 },
];

export const attendanceByTrack = [
  { track: 'Main Stage', value: 4200, color: 'var(--chart-purple)' },
  { track: 'Innovation Lab', value: 2800, color: 'var(--chart-violet)' },
  { track: 'Workshop Hall', value: 1900, color: 'var(--chart-indigo)' },
  { track: 'Expo Floor', value: 3100, color: 'var(--chart-blue)' },
  { track: 'Networking Lounge', value: 1500, color: 'var(--chart-cyan)' },
];

export const hourlyAttendance = [
  { time: '8AM', value: 2100 },
  { time: '9AM', value: 5400 },
  { time: '10AM', value: 7200 },
  { time: '11AM', value: 8100 },
  { time: '12PM', value: 7800 },
  { time: '1PM', value: 6900 },
  { time: '2PM', value: 8200 },
  { time: '3PM', value: 8750 },
  { time: '4PM', value: 7100 },
  { time: '5PM', value: 4200 },
];

// ── Job Leveling & Purchasing Power ─────────────────────────────────────────

export const attendeesByLevel = [
  { level: 'C-Suite', count: 890, avgSpend: 12400, color: 'var(--chart-purple)' },
  { level: 'VP / Director', count: 2100, avgSpend: 8200, color: 'var(--chart-violet)' },
  { level: 'Manager', count: 3200, avgSpend: 5100, color: 'var(--chart-indigo)' },
  { level: 'Individual Contributor', count: 2800, avgSpend: 2800, color: 'var(--chart-blue)' },
  { level: 'Student / Early Career', count: 932, avgSpend: 900, color: 'var(--chart-cyan)' },
];

export const industryBreakdown = [
  { industry: 'Technology', value: 35, color: 'var(--chart-purple)' },
  { industry: 'Finance', value: 22, color: 'var(--chart-violet)' },
  { industry: 'Healthcare', value: 15, color: 'var(--chart-indigo)' },
  { industry: 'Manufacturing', value: 12, color: 'var(--chart-blue)' },
  { industry: 'Retail', value: 9, color: 'var(--chart-cyan)' },
  { industry: 'Other', value: 7, color: 'var(--chart-teal)' },
];

export const purchasingIntent = {
  highIntent: 34,
  mediumIntent: 41,
  lowIntent: 25,
};

// ── Budget vs Actual ────────────────────────────────────────────────────────

export const budgetCategories = [
  { category: 'Venue & Setup', budget: 250000, actual: 242000 },
  { category: 'AV & Production', budget: 180000, actual: 195000 },
  { category: 'Catering', budget: 120000, actual: 118000 },
  { category: 'Marketing', budget: 95000, actual: 88000 },
  { category: 'Speaker Fees', budget: 75000, actual: 79000 },
  { category: 'Travel & Lodging', budget: 60000, actual: 54000 },
  { category: 'Staffing', budget: 45000, actual: 47000 },
  { category: 'Miscellaneous', budget: 25000, actual: 21000 },
];

export const budgetSummary = {
  totalBudget: 850000,
  totalActual: 844000,
  variance: -0.7,
};

// ── Staff & Vendor Performance ──────────────────────────────────────────────

export const staffPerformance = [
  { name: 'Registration Team', rating: 4.7, tasksCompleted: 98, responseTime: '1.2 min' },
  { name: 'AV / Tech Crew', rating: 4.5, tasksCompleted: 95, responseTime: '2.8 min' },
  { name: 'Security', rating: 4.6, tasksCompleted: 100, responseTime: '1.5 min' },
  { name: 'Catering Staff', rating: 4.2, tasksCompleted: 92, responseTime: '3.1 min' },
  { name: 'Event Coordinators', rating: 4.8, tasksCompleted: 97, responseTime: '0.9 min' },
];

export const vendorRatings = [
  { vendor: 'AV Partner Co.', rating: 4.6, onTime: 96, color: 'var(--chart-purple)' },
  { vendor: 'Premier Catering', rating: 4.1, onTime: 89, color: 'var(--chart-violet)' },
  { vendor: 'SecureEvents Inc.', rating: 4.7, onTime: 100, color: 'var(--chart-indigo)' },
  { vendor: 'StageLight Pro', rating: 4.4, onTime: 93, color: 'var(--chart-blue)' },
  { vendor: 'TransportNow', rating: 3.9, onTime: 85, color: 'var(--chart-cyan)' },
];
