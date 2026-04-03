import {
  getFeatureUsageKPIs,
  getFeatureUsageTrend,
  getCategoryBreakdown,
  getEventBreakdown,
} from "@/lib/queries";
import { FeatureUsageKPICards } from "./_components/feature-usage-kpi-cards";
import { FeatureUsageTrendChart } from "./_components/feature-usage-trend-chart";
import { CategoryBreakdownTable } from "./_components/category-breakdown-table";
import { EventBreakdownTable } from "./_components/event-breakdown-table";

export const dynamic = "force-dynamic";

export default async function FeatureUsagePage() {
  const emptyKpis = { totalEvents: 0, uniqueUsers: 0, events7d: 0, uniqueUsers7d: 0 };
  const [kpis, trend, categories, events] = await Promise.all([
    getFeatureUsageKPIs().catch(() => emptyKpis),
    getFeatureUsageTrend(30).catch(() => []),
    getCategoryBreakdown().catch(() => []),
    getEventBreakdown().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <FeatureUsageKPICards data={kpis} />
      <FeatureUsageTrendChart data={trend} />
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdownTable data={categories} />
        <EventBreakdownTable data={events} />
      </div>
    </div>
  );
}
