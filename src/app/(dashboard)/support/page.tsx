import { getSupportKPIs, getSupportRequests } from "@/lib/queries";
import { SupportKPICards } from "./_components/support-kpis";
import { SupportTable } from "./_components/support-table";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const emptyKpis = { total: 0, last7d: 0, today: 0 };
  const [kpis, requests] = await Promise.all([
    getSupportKPIs().catch(() => emptyKpis),
    getSupportRequests(100).catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <SupportKPICards data={kpis} />
      <SupportTable data={requests} />
    </div>
  );
}
