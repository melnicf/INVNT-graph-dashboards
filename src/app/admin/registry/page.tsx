import { getDashboards, getGraphs } from '@/lib/actions/dashboard-config';
import { RegistryWithPreview } from '@/components/admin/GraphPreview';

export default async function RegistryPage() {
  const [allDashboards, allGraphs] = await Promise.all([
    getDashboards(),
    getGraphs(),
  ]);

  const grouped = allDashboards.map((d) => ({
    dashboard: d,
    graphs: allGraphs.filter((g) => g.dashboardKey === d.key),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Graph Registry</h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-8">
        All available dashboards and graphs registered in the system. Hover over a graph to preview it.
      </p>

      <RegistryWithPreview grouped={grouped} />
    </div>
  );
}
