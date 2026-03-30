import { getSupabase } from "./supabase";

export interface KPIs {
  totalUsers: number;
  totalWorkouts: number;
  avgDuration: number;
  avgCalories: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface EffortBucket {
  level: number;
  count: number;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_name: string;
  properties: Record<string, unknown>;
  created_at: string;
}

function fillGaps(data: { date: string; count: number }[], days: number): TrendPoint[] {
  const map = new Map(data.map((d) => [d.date, d.count]));
  const result: TrendPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }

  return result;
}

export async function getKPIs(): Promise<KPIs> {
  const supabase = getSupabase();
  const [usersRes, workoutsRes] = await Promise.all([
    supabase.from("User").select("id", { count: "exact", head: true }),
    supabase
      .from("workout_sessions")
      .select("duration_minutes, calories")
      .eq("status", "completed"),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const workouts = workoutsRes.data ?? [];
  const totalWorkouts = workouts.length;

  let avgDuration = 0;
  let avgCalories = 0;

  if (totalWorkouts > 0) {
    const sumDuration = workouts.reduce((s, w) => s + (w.duration_minutes ?? 0), 0);
    const sumCalories = workouts.reduce((s, w) => s + (w.calories ?? 0), 0);
    avgDuration = Math.round(sumDuration / totalWorkouts);
    avgCalories = Math.round(sumCalories / totalWorkouts);
  }

  return { totalUsers, totalWorkouts, avgDuration, avgCalories };
}

export async function getRegistrationTrend(days = 30): Promise<TrendPoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await getSupabase()
    .from("analytics_events")
    .select("created_at")
    .eq("event_name", "user_registered")
    .gte("created_at", since.toISOString());

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const date = row.created_at.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return fillGaps(
    Array.from(counts, ([date, count]) => ({ date, count })),
    days
  );
}

export async function getWorkoutTrend(days = 30): Promise<TrendPoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await getSupabase()
    .from("workout_sessions")
    .select("completed_at")
    .eq("status", "completed")
    .gte("completed_at", since.toISOString());

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.completed_at) continue;
    const date = row.completed_at.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return fillGaps(
    Array.from(counts, ([date, count]) => ({ date, count })),
    days
  );
}

export async function getEffortDistribution(): Promise<EffortBucket[]> {
  const { data } = await getSupabase()
    .from("session_feedback")
    .select("effort_level");

  const counts = new Map<number, number>();
  for (const row of data ?? []) {
    const level = row.effort_level;
    counts.set(level, (counts.get(level) ?? 0) + 1);
  }

  return Array.from(counts, ([level, count]) => ({ level, count })).sort(
    (a, b) => a.level - b.level
  );
}

export async function getRecentEvents(limit = 50): Promise<AnalyticsEvent[]> {
  const { data } = await getSupabase()
    .from("analytics_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as AnalyticsEvent[]) ?? [];
}
