import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getUserDetail,
  getUserKPIs,
  getUserWorkoutHistory,
  getUserWorkoutTrend,
  getUserCoachStats,
  getUserPosts,
  getUserEvents,
} from "@/lib/queries";
import { UserProfileHeader } from "./_components/user-profile-header";
import { UserKPICards } from "./_components/user-kpi-cards";
import { UserWorkoutChart } from "./_components/user-workout-chart";
import { UserCoachStats } from "./_components/user-coach-stats";
import { UserWorkoutHistory } from "./_components/user-workout-history";
import { UserPostsList } from "./_components/user-posts-list";
import { UserActivityTimeline } from "./_components/user-activity-timeline";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [user, kpis, workouts, trend, coachStats, posts, events] =
    await Promise.all([
      getUserDetail(id),
      getUserKPIs(id),
      getUserWorkoutHistory(id, 20),
      getUserWorkoutTrend(id, 30),
      getUserCoachStats(id),
      getUserPosts(id, 10),
      getUserEvents(id, 100),
    ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-200"
      >
        ← Back to dashboard
      </Link>

      <UserProfileHeader user={user} />

      <UserKPICards data={kpis} />

      <div className="grid gap-6 md:grid-cols-2">
        <UserWorkoutChart data={trend} />
        <UserCoachStats data={coachStats} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UserWorkoutHistory workouts={workouts} />
        <UserPostsList posts={posts} />
      </div>

      <UserActivityTimeline events={events} />
    </div>
  );
}
