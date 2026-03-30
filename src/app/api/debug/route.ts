import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET() {
  try {
    const [users, workouts, events] = await Promise.all([
      queryOne<{ count: string }>('SELECT count(*) FROM "User"'),
      queryOne<{ count: string }>("SELECT count(*) FROM workout_sessions"),
      queryOne<{ count: string }>("SELECT count(*) FROM analytics_events"),
    ]);

    return NextResponse.json({
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "missing",
      },
      users: users?.count,
      workouts: workouts?.count,
      events: events?.count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
