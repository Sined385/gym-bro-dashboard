import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();

  const [users, workouts, events] = await Promise.all([
    supabase.from("User").select("id", { count: "exact", head: true }),
    supabase.from("workout_sessions").select("id").limit(5),
    supabase.from("analytics_events").select("id").limit(5),
  ]);

  return NextResponse.json({
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? "set" : "missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing",
      SUPABASE_KEY: process.env.SUPABASE_KEY ? "set" : "missing",
    },
    users: { data: users.data, count: users.count, error: users.error },
    workouts: { data: workouts.data, error: workouts.error },
    events: { data: events.data, error: events.error },
  });
}
