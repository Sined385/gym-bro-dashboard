import {
  getAcquisitionKPIs,
  getAcquisitionTrend,
  getOnboardingFunnel,
  getDauTrend,
  getRetentionCohorts,
  type AcquisitionKPIs,
} from "@/lib/queries";
import { AcquisitionChart } from "./_components/acquisition-chart";
import { DauChart } from "./_components/dau-chart";
import { OnboardingFunnel } from "./_components/onboarding-funnel";
import { RetentionTable } from "./_components/retention-table";

export const dynamic = "force-dynamic";

const cards: { key: keyof AcquisitionKPIs; label: string; suffix: string }[] = [
  { key: "newUsers7d", label: "New Users (7d)", suffix: "" },
  { key: "completionRate30d", label: "Onboarding Completion (30d)", suffix: "%" },
  { key: "d1Retention", label: "D1 Retention (30d)", suffix: "%" },
  { key: "d7Retention", label: "D7 Retention (30d)", suffix: "%" },
];

export default async function AcquisitionPage() {
  const [kpis, trend, funnel, dau, cohorts] = await Promise.all([
    getAcquisitionKPIs(),
    getAcquisitionTrend(30),
    getOnboardingFunnel(30),
    getDauTrend(30),
    getRetentionCohorts(8),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">
              {kpis[card.key].toLocaleString()}
              {card.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AcquisitionChart data={trend} />
        <DauChart data={dau} />
      </div>

      <OnboardingFunnel steps={funnel} />

      <RetentionTable cohorts={cohorts} />
    </div>
  );
}
