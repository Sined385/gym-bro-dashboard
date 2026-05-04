import {
  getKPIs,
  getRegistrationTrend,
  getWorkoutTrend,
  getUserActivity,
  getRecentEvents,
} from "@/lib/queries";
import { KPICards } from "./_components/kpi-cards";
import { RegistrationChart } from "./_components/registration-chart";
import { WorkoutChart } from "./_components/workout-chart";
import { UserActivityTable } from "./_components/user-activity-table";
import { RecentEventsTable } from "./_components/recent-events-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [kpis, registrations, workouts, users, events] = await Promise.all([
    getKPIs(),
    getRegistrationTrend(30),
    getWorkoutTrend(30),
    getUserActivity(q),
    getRecentEvents(50),
  ]);

  return (
    <div className="space-y-6">
      <KPICards data={kpis} />

      <div className="grid gap-6 md:grid-cols-2">
        <RegistrationChart data={registrations} />
        <WorkoutChart data={workouts} />
      </div>

      <UserActivityTable users={users} search={q} />

      <RecentEventsTable events={events} />
    </div>
  );
}
