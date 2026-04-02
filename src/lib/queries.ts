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
     LEFT JOIN workout_sessions ws ON ws.user_id = u.id::text AND ws.status = 'completed'
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

// ── User Detail Queries ──────────────────────────────────

export interface UserDetail {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string;
  primary_goals: string[] | null;
  experience_level: string | null;
  training_frequency: number | null;
  available_equipment: string | null;
}

export interface UserKPIData {
  workoutCount: number;
  totalDurationMinutes: number;
  avgDurationMinutes: number;
  totalCalories: number;
  coachMessages: number;
  postCount: number;
  likesReceived: number;
  followerCount: number;
}

export interface UserWorkout {
  id: string;
  title: string;
  type: string;
  duration_minutes: number | null;
  calories: number | null;
  completed_at: string;
}

export interface UserCoachStatsData {
  conversationCount: number;
  userMessages: number;
  aiMessages: number;
  firstMessageAt: string | null;
  lastMessageAt: string | null;
}

export interface UserPost {
  id: string;
  content: string;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export async function getUserDetail(id: string): Promise<UserDetail | null> {
  return queryOne<UserDetail>(
    `SELECT
       u.id, u.email, u.full_name, u.avatar_url, u.username, u.created_at,
       od.primary_goals, od.experience_level, od.training_frequency, od.available_equipment
     FROM "User" u
     LEFT JOIN onboarding_data od ON od.user_id = u.id::text
     WHERE u.id = $1`,
    [id]
  );
}

export async function getUserKPIs(id: string): Promise<UserKPIData> {
  const [workouts, coach, posts, likes, followers] = await Promise.all([
    queryOne<{ count: string; total_dur: string; avg_dur: string; total_cal: string }>(
      `SELECT count(*) as count,
              coalesce(sum(duration_minutes), 0) as total_dur,
              coalesce(avg(duration_minutes), 0) as avg_dur,
              coalesce(sum(calories), 0) as total_cal
       FROM workout_sessions WHERE user_id = $1 AND status = 'completed'`,
      [id]
    ),
    queryOne<{ count: string }>(
      `SELECT count(*) as count FROM coach_messages cm
       JOIN coach_conversations cc ON cc.id = cm.conversation_id
       WHERE cc.user_id = $1 AND cm.role = 'user'`,
      [id]
    ),
    queryOne<{ count: string }>(
      `SELECT count(*) as count FROM posts WHERE user_id = $1`,
      [id]
    ),
    queryOne<{ count: string }>(
      `SELECT count(*) as count FROM post_likes pl
       JOIN posts p ON p.id = pl.post_id
       WHERE p.user_id = $1`,
      [id]
    ),
    queryOne<{ count: string }>(
      `SELECT count(*) as count FROM follows WHERE following_id = $1`,
      [id]
    ),
  ]);

  return {
    workoutCount: parseInt(workouts?.count ?? "0"),
    totalDurationMinutes: parseInt(workouts?.total_dur ?? "0"),
    avgDurationMinutes: Math.round(parseFloat(workouts?.avg_dur ?? "0")),
    totalCalories: parseInt(workouts?.total_cal ?? "0"),
    coachMessages: parseInt(coach?.count ?? "0"),
    postCount: parseInt(posts?.count ?? "0"),
    likesReceived: parseInt(likes?.count ?? "0"),
    followerCount: parseInt(followers?.count ?? "0"),
  };
}

export async function getUserWorkoutHistory(id: string, limit = 20): Promise<UserWorkout[]> {
  return query<UserWorkout>(
    `SELECT id, title, type, duration_minutes, calories, completed_at::text
     FROM workout_sessions
     WHERE user_id = $1 AND status = 'completed'
     ORDER BY completed_at DESC
     LIMIT $2`,
    [id, limit]
  );
}

export async function getUserWorkoutTrend(id: string, days = 30): Promise<TrendPoint[]> {
  const rows = await query<{ date: string; count: string }>(
    `SELECT completed_at::date::text as date, count(*) as count
     FROM workout_sessions
     WHERE user_id = $1 AND status = 'completed' AND completed_at >= now() - make_interval(days => $2)
     GROUP BY completed_at::date
     ORDER BY date`,
    [id, days]
  );

  return fillGaps(
    rows.map((r) => ({ date: r.date, count: parseInt(r.count) })),
    days
  );
}

export async function getUserCoachStats(id: string): Promise<UserCoachStatsData> {
  const [convos, msgs] = await Promise.all([
    queryOne<{ count: string }>(
      `SELECT count(*) as count FROM coach_conversations WHERE user_id = $1`,
      [id]
    ),
    queryOne<{ user_msgs: string; ai_msgs: string; first_at: string | null; last_at: string | null }>(
      `SELECT
         count(*) FILTER (WHERE cm.role = 'user') as user_msgs,
         count(*) FILTER (WHERE cm.role = 'assistant') as ai_msgs,
         min(cm.created_at)::text as first_at,
         max(cm.created_at)::text as last_at
       FROM coach_messages cm
       JOIN coach_conversations cc ON cc.id = cm.conversation_id
       WHERE cc.user_id = $1`,
      [id]
    ),
  ]);

  return {
    conversationCount: parseInt(convos?.count ?? "0"),
    userMessages: parseInt(msgs?.user_msgs ?? "0"),
    aiMessages: parseInt(msgs?.ai_msgs ?? "0"),
    firstMessageAt: msgs?.first_at ?? null,
    lastMessageAt: msgs?.last_at ?? null,
  };
}

export async function getUserPosts(id: string, limit = 10): Promise<UserPost[]> {
  const rows = await query<{
    id: string;
    content: string;
    like_count: string;
    comment_count: string;
    created_at: string;
  }>(
    `SELECT
       p.id, p.content, p.created_at::text,
       (SELECT count(*) FROM post_likes WHERE post_id = p.id)::text as like_count,
       (SELECT count(*) FROM post_comments WHERE post_id = p.id)::text as comment_count
     FROM posts p
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2`,
    [id, limit]
  );

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    like_count: parseInt(r.like_count),
    comment_count: parseInt(r.comment_count),
    created_at: r.created_at,
  }));
}

export async function getUserEvents(id: string, limit = 100): Promise<RecentEvent[]> {
  return query<RecentEvent>(
    `SELECT
       ae.id, ae.user_id, ae.event_name, ae.properties, ae.created_at,
       u.email as user_email, u.full_name as user_name
     FROM analytics_events ae
     LEFT JOIN "User" u ON u.id::text = ae.user_id
     WHERE ae.user_id = $1
     ORDER BY ae.created_at DESC
     LIMIT $2`,
    [id, limit]
  );
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
     LEFT JOIN "User" u ON u.id::text = ae.user_id
     ORDER BY ae.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return rows;
}

// ── AI Usage Queries ──────────────────────────────────

export interface AiUsageKPIs {
  totalTokens: number;
  totalCost: number;
  totalCalls: number;
  avgCostPerCall: number;
  cost7d: number;
  calls7d: number;
}

export interface AiUsageTrendPoint {
  date: string;
  cost: number;
  tokens: number;
}

export interface AiUsageByFeature {
  feature: string;
  calls: number;
  totalTokens: number;
  totalCost: number;
  avgCostPerCall: number;
}

export interface AiUsageByUser {
  userId: string;
  email: string;
  fullName: string | null;
  calls: number;
  totalTokens: number;
  totalCost: number;
  topFeature: string | null;
}

export interface UserAiUsageRow {
  feature: string;
  calls: number;
  totalTokens: number;
  totalCost: number;
}

export async function getAiUsageKPIs(): Promise<AiUsageKPIs> {
  const [allTime, last7d] = await Promise.all([
    queryOne<{ total_tokens: string; total_cost: string; total_calls: string }>(
      `SELECT
         coalesce(sum(total_tokens), 0) as total_tokens,
         coalesce(sum(estimated_cost), 0) as total_cost,
         count(*) as total_calls
       FROM ai_usage`
    ),
    queryOne<{ cost: string; calls: string }>(
      `SELECT
         coalesce(sum(estimated_cost), 0) as cost,
         count(*) as calls
       FROM ai_usage
       WHERE created_at >= now() - interval '7 days'`
    ),
  ]);

  const totalCalls = parseInt(allTime?.total_calls ?? "0");
  const totalCost = parseFloat(allTime?.total_cost ?? "0");

  return {
    totalTokens: parseInt(allTime?.total_tokens ?? "0"),
    totalCost,
    totalCalls,
    avgCostPerCall: totalCalls > 0 ? totalCost / totalCalls : 0,
    cost7d: parseFloat(last7d?.cost ?? "0"),
    calls7d: parseInt(last7d?.calls ?? "0"),
  };
}

export async function getAiUsageTrend(days = 30): Promise<AiUsageTrendPoint[]> {
  const rows = await query<{ date: string; cost: string; tokens: string }>(
    `SELECT
       created_at::date::text as date,
       sum(estimated_cost)::text as cost,
       sum(total_tokens)::text as tokens
     FROM ai_usage
     WHERE created_at >= now() - make_interval(days => $1)
     GROUP BY created_at::date
     ORDER BY date`,
    [days]
  );

  const map = new Map(rows.map((r) => [r.date, { cost: parseFloat(r.cost), tokens: parseInt(r.tokens) }]));
  const result: AiUsageTrendPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = map.get(key);
    result.push({ date: key, cost: entry?.cost ?? 0, tokens: entry?.tokens ?? 0 });
  }

  return result;
}

export async function getAiUsageByFeature(): Promise<AiUsageByFeature[]> {
  const rows = await query<{
    feature: string;
    calls: string;
    total_tokens: string;
    total_cost: string;
  }>(
    `SELECT
       feature,
       count(*) as calls,
       sum(total_tokens)::text as total_tokens,
       sum(estimated_cost)::text as total_cost
     FROM ai_usage
     GROUP BY feature
     ORDER BY sum(estimated_cost) DESC`
  );

  return rows.map((r) => {
    const calls = parseInt(r.calls);
    const totalCost = parseFloat(r.total_cost);
    return {
      feature: r.feature,
      calls,
      totalTokens: parseInt(r.total_tokens),
      totalCost,
      avgCostPerCall: calls > 0 ? totalCost / calls : 0,
    };
  });
}

export async function getAiUsageByUser(limit = 50): Promise<AiUsageByUser[]> {
  const rows = await query<{
    user_id: string;
    email: string;
    full_name: string | null;
    calls: string;
    total_tokens: string;
    total_cost: string;
    top_feature: string | null;
  }>(
    `SELECT
       a.user_id,
       u.email,
       u.full_name,
       count(*)::text as calls,
       sum(a.total_tokens)::text as total_tokens,
       sum(a.estimated_cost)::text as total_cost,
       (SELECT feature FROM ai_usage a2 WHERE a2.user_id = a.user_id GROUP BY feature ORDER BY count(*) DESC LIMIT 1) as top_feature
     FROM ai_usage a
     JOIN "User" u ON u.id::text = a.user_id
     GROUP BY a.user_id, u.email, u.full_name
     ORDER BY sum(a.estimated_cost) DESC
     LIMIT $1`,
    [limit]
  );

  return rows.map((r) => ({
    userId: r.user_id,
    email: r.email,
    fullName: r.full_name,
    calls: parseInt(r.calls),
    totalTokens: parseInt(r.total_tokens),
    totalCost: parseFloat(r.total_cost),
    topFeature: r.top_feature,
  }));
}

export async function getUserAiUsage(userId: string): Promise<UserAiUsageRow[]> {
  const rows = await query<{
    feature: string;
    calls: string;
    total_tokens: string;
    total_cost: string;
  }>(
    `SELECT
       feature,
       count(*) as calls,
       sum(total_tokens)::text as total_tokens,
       sum(estimated_cost)::text as total_cost
     FROM ai_usage
     WHERE user_id = $1
     GROUP BY feature
     ORDER BY sum(estimated_cost) DESC`,
    [userId]
  );

  return rows.map((r) => ({
    feature: r.feature,
    calls: parseInt(r.calls),
    totalTokens: parseInt(r.total_tokens),
    totalCost: parseFloat(r.total_cost),
  }));
}
