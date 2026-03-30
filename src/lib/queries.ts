import { getSupabase } from "./supabase";

export interface KPIs {
  totalUsers: number;
  totalWorkouts: number;
  avgDuration: number;
  activeUsers7d: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface UserActivity {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  workout_count: number;
  last_active: string | null;
}

export interface RecentEvent {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
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
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [usersRes, workoutsRes, recentSessionsRes] = await Promise.all([
    supabase.from("User").select("id", { count: "exact", head: true }),
    supabase
      .from("workout_sessions")
      .select("duration_minutes")
      .eq("status", "completed"),
    supabase
      .from("workout_sessions")
      .select("user_id")
      .eq("status", "completed")
      .gte("completed_at", sevenDaysAgo.toISOString()),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const workouts = workoutsRes.data ?? [];
  const totalWorkouts = workouts.length;

  let avgDuration = 0;
  if (totalWorkouts > 0) {
    const sumDuration = workouts.reduce((s, w) => s + (w.duration_minutes ?? 0), 0);
    avgDuration = Math.round(sumDuration / totalWorkouts);
  }

  const activeUserIds = new Set((recentSessionsRes.data ?? []).map((r) => r.user_id));
  const activeUsers7d = activeUserIds.size;

  return { totalUsers, totalWorkouts, avgDuration, activeUsers7d };
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

export async function getUserActivity(): Promise<UserActivity[]> {
  const supabase = getSupabase();

  const [usersRes, sessionsRes] = await Promise.all([
    supabase
      .from("User")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("workout_sessions")
      .select("user_id, completed_at")
      .eq("status", "completed"),
  ]);

  const users = usersRes.data ?? [];
  const sessions = sessionsRes.data ?? [];

  // Build per-user stats
  const statsMap = new Map<string, { count: number; lastActive: string | null }>();
  for (const s of sessions) {
    const prev = statsMap.get(s.user_id);
    const completedAt = s.completed_at as string | null;
    if (!prev) {
      statsMap.set(s.user_id, { count: 1, lastActive: completedAt });
    } else {
      prev.count++;
      if (completedAt && (!prev.lastActive || completedAt > prev.lastActive)) {
        prev.lastActive = completedAt;
      }
    }
  }

  return users.map((u) => {
    const stats = statsMap.get(u.id);
    return {
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
      workout_count: stats?.count ?? 0,
      last_active: stats?.lastActive ?? null,
    };
  });
}

export async function getRecentEvents(limit = 50): Promise<RecentEvent[]> {
  const supabase = getSupabase();

  const [eventsRes, usersRes] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("User").select("id, email, full_name"),
  ]);

  const events = (eventsRes.data ?? []) as {
    id: string;
    user_id: string;
    event_name: string;
    properties: Record<string, unknown>;
    created_at: string;
  }[];
  const userMap = new Map(
    (usersRes.data ?? []).map((u) => [u.id, { email: u.email, name: u.full_name }])
  );

  return events.map((e) => {
    const user = userMap.get(e.user_id);
    return {
      ...e,
      user_email: user?.email ?? null,
      user_name: user?.name ?? null,
    };
  });
}
