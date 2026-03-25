/**
 * Canonical labels for dashboards (may differ from legacy `dashboards.name` in DB).
 */
const DASHBOARD_NAME_BY_KEY: Partial<Record<string, string>> = {
  client: 'Post Insights',
};

export function dashboardDisplayName(key: string, storedName: string): string {
  return DASHBOARD_NAME_BY_KEY[key] ?? storedName;
}
