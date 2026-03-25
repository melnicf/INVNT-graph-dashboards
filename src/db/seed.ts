import { loadDbEnv } from './load-env';

loadDbEnv();
import { drizzle } from 'drizzle-orm/node-postgres';
import { hash } from 'bcryptjs';
import * as schema from './schema';

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  console.log('🌱 Seeding database…');

  // ── 1. Super-admin user ────────────────────────────────────────────────────
  const passwordHash = await hash('admin123', 12);

  await db
    .insert(schema.users)
    .values({
      email: 'admin@invnt.com',
      passwordHash,
      name: 'Super Admin',
      role: 'super_admin',
    })
    .onConflictDoNothing({ target: schema.users.email });

  console.log('  ✓ Super-admin user created (admin@invnt.com / admin123)');

  // ── 2. Register dashboards ─────────────────────────────────────────────────
  const dashboardSeed = [
    {
      key: 'predictive',
      name: 'Predictive Analytics',
      description: 'Pre-event forecasting and risk assessment',
    },
    {
      key: 'production',
      name: 'Live',
      description: 'Real-time event monitoring (40" TV setup)',
    },
    {
      key: 'client',
      name: 'Post Insights',
      description: 'Mobile-optimized client metrics',
    },
  ];

  for (const d of dashboardSeed) {
    await db
      .insert(schema.dashboards)
      .values(d)
      .onConflictDoUpdate({
        target: schema.dashboards.key,
        set: {
          name: d.name,
          description: d.description,
        },
      });
  }

  console.log('  ✓ Dashboards registered');

  // ── 3. Register graphs ─────────────────────────────────────────────────────
  const graphSeed = [
    // Predictive Analytics (8 graphs)
    { key: 'temporalFavorability', name: 'Temporal & Environmental Favorability', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'locationSuitability', name: 'Location, City & Venue Suitability', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'contentAlignment', name: 'Attendee Content Alignment', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'economicSentiment', name: 'Economic Sentiment & Spend', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'attendanceReliability', name: 'Attendance Reliability', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'networkDensity', name: 'Network Density & Potential', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'operationalStrain', name: 'Operational Strain & Risk', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },
    { key: 'brandStorytelling', name: 'Brand Storytelling Effectiveness', dashboardKey: 'predictive', component: 'PredictiveAnalyticsDashboard' },

    // Production Dashboard (8 graphs)
    { key: 'dwellTime', name: 'Dwell Time', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'dwellBySeniority', name: 'Dwell by Seniority', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'dwellByZone', name: 'Dwell by Zone', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'attendeesOnSite', name: 'Attendees on Site', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'interestByZone', name: 'Interest × Zone', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'interestByContent', name: 'Interest × Content', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'audioSentiment', name: 'Audio × Sentiment', dashboardKey: 'production', component: 'ProductionDashboard' },
    { key: 'presenterTime', name: 'Presenter × Time', dashboardKey: 'production', component: 'ProductionDashboard' },

    // Post Insights (semantic graph keys → dashboard sections)
    { key: 'postSentiment', name: 'Sentiment Analysis', dashboardKey: 'client', component: 'ClientViewDashboard' },
    { key: 'postSurvey', name: 'Survey Analysis', dashboardKey: 'client', component: 'ClientViewDashboard' },
    { key: 'postAttendance', name: 'Attendance Analysis', dashboardKey: 'client', component: 'ClientViewDashboard' },
    { key: 'postJobLeveling', name: 'Job Leveling & Purchasing', dashboardKey: 'client', component: 'ClientViewDashboard' },
    { key: 'postBudget', name: 'Budget vs Actual', dashboardKey: 'client', component: 'ClientViewDashboard' },
    { key: 'postStaffVendor', name: 'Staff & Vendor Performance', dashboardKey: 'client', component: 'ClientViewDashboard' },
  ];

  for (const g of graphSeed) {
    await db
      .insert(schema.graphs)
      .values(g)
      .onConflictDoNothing();
  }

  console.log('  ✓ Graphs registered');
  console.log('🌱 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
