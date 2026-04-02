import {
  getAiUsageKPIs,
  getAiUsageTrend,
  getAiUsageByFeature,
  getAiUsageByUser,
} from "@/lib/queries";
import { AiUsageKPICards } from "./_components/ai-usage-kpi-cards";
import { AiUsageTrendChart } from "./_components/ai-usage-trend-chart";
import { AiUsageFeatureTable } from "./_components/ai-usage-feature-table";
import { AiUsageUserTable } from "./_components/ai-usage-user-table";

export const dynamic = "force-dynamic";

export default async function AiUsagePage() {
  const emptyKpis = { totalTokens: 0, totalCost: 0, totalCalls: 0, avgCostPerCall: 0, cost7d: 0, calls7d: 0 };
  const [kpis, trend, byFeature, byUser] = await Promise.all([
    getAiUsageKPIs().catch(() => emptyKpis),
    getAiUsageTrend(30).catch(() => []),
    getAiUsageByFeature().catch(() => []),
    getAiUsageByUser(50).catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <AiUsageKPICards data={kpis} />
      <AiUsageTrendChart data={trend} />
      <div className="grid gap-6 md:grid-cols-2">
        <AiUsageFeatureTable data={byFeature} />
        <AiUsageUserTable data={byUser} />
      </div>
    </div>
  );
}
