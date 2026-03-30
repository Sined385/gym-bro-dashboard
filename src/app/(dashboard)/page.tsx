import {
  getKPIs,
  getRegistrationTrend,
  getWorkoutTrend,
  getEffortDistribution,
  getRecentEvents,
} from "@/lib/queries";
import { KPICards } from "./_components/kpi-cards";
import { RegistrationChart } from "./_components/registration-chart";
import { WorkoutChart } from "./_components/workout-chart";
import { EffortChart } from "./_components/effort-chart";
import { RecentEventsTable } from "./_components/recent-events-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, registrations, workouts, effort, events] = await Promise.all([
    getKPIs(),
    getRegistrationTrend(30),
    getWorkoutTrend(30),
    getEffortDistribution(),
    getRecentEvents(50),
  ]);

  return (
    <div className="space-y-6">
      <KPICards data={kpis} />

      <div className="grid gap-6 md:grid-cols-2">
        <RegistrationChart data={registrations} />
        <WorkoutChart data={workouts} />
      </div>

      <EffortChart data={effort} />

      <RecentEventsTable events={events} />
    </div>
  );
}
