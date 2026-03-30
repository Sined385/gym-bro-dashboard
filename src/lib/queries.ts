import { query, queryOne } from "./db";

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
  const [users, workouts, active] = await Promise.all([
    queryOne<{ count: string }>('SELECT count(*) FROM "User"'),
    queryOne<{ count: string; avg_dur: string }>(
      `SELECT count(*) as count, coalesce(avg(duration_minutes), 0) as avg_dur
       FROM workout_sessions WHERE status = 'completed'`
    ),
    queryOne<{ count: string }>(
      `SELECT count(DISTINCT user_id) as count
       FROM workout_sessions
       WHERE status = 'completed' AND completed_at >= now() - interval '7 days'`
    ),
  ]);

  return {
    totalUsers: parseInt(users?.count ?? "0"),
    totalWorkouts: parseInt(workouts?.count ?? "0"),
    avgDuration: Math.round(parseFloat(workouts?.avg_dur ?? "0")),
    activeUsers7d: parseInt(active?.count ?? "0"),
  };
}

export async function getRegistrationTrend(days = 30): Promise<TrendPoint[]> {
  const rows = await query<{ date: string; count: string }>(
    `SELECT created_at::date::text as date, count(*) as count
     FROM analytics_events
     WHERE event_name = 'user_registered' AND created_at >= now() - make_interval(days => $1)
     GROUP BY created_at::date
     ORDER BY date`,
    [days]
  );

  return fillGaps(
    rows.map((r) => ({ date: r.date, count: parseInt(r.count) })),
    days
  );
}

export async function getWorkoutTrend(days = 30): Promise<TrendPoint[]> {
  const rows = await query<{ date: string; count: string }>(
    `SELECT completed_at::date::text as date, count(*) as count
     FROM workout_sessions
     WHERE status = 'completed' AND completed_at >= now() - make_interval(days => $1)
     GROUP BY completed_at::date
     ORDER BY date`,
    [days]
  );

  return fillGaps(
    rows.map((r) => ({ date: r.date, count: parseInt(r.count) })),
    days
  );
}

export async function getUserActivity(): Promise<UserActivity[]> {
  const rows = await query<{
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    workout_count: string;
    last_active: string | null;
  }>(
    `SELECT
       u.id, u.email, u.full_name, u.created_at,
       count(ws.id)::text as workout_count,
       max(ws.completed_at)::text as last_active
     FROM "User" u
     LEFT JOIN workout_sessions ws ON ws.user_id = u.id AND ws.status = 'completed'
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    full_name: r.full_name,
    created_at: r.created_at,
    workout_count: parseInt(r.workout_count),
    last_active: r.last_active,
  }));
}

export async function getRecentEvents(limit = 50): Promise<RecentEvent[]> {
  const rows = await query<{
    id: string;
    user_id: string;
    user_email: string | null;
    user_name: string | null;
    event_name: string;
    properties: Record<string, unknown>;
    created_at: string;
  }>(
    `SELECT
       ae.id, ae.user_id, ae.event_name, ae.properties, ae.created_at,
       u.email as user_email, u.full_name as user_name
     FROM analytics_events ae
     LEFT JOIN "User" u ON u.id = ae.user_id
     ORDER BY ae.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return rows;
}
