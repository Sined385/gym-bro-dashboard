import {
  getPromoCodes,
  getPromoKPIs,
  getPromoRedemptionTrend,
} from "@/lib/queries";
import { CreateCodeForm } from "./_components/create-code-form";
import { CodesTable } from "./_components/codes-table";
import { RedemptionsChart } from "./_components/redemptions-chart";

export const dynamic = "force-dynamic";

export default async function PromoCodesPage() {
  const [codes, kpis, trend] = await Promise.all([
    getPromoCodes(),
    getPromoKPIs(),
    getPromoRedemptionTrend(30),
  ]);

  const cards = [
    { label: "Total codes", value: kpis.totalCodes },
    { label: "Active codes", value: kpis.activeCodes },
    { label: "Total redemptions", value: kpis.totalRedemptions },
    { label: "Redemptions (7d)", value: kpis.redemptions7d },
    { label: "Active promo users", value: kpis.activePromoUsers },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Promo Codes</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-100">
              {card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <CreateCodeForm />

      <RedemptionsChart data={trend} />

      <CodesTable codes={codes} />
    </div>
  );
}
