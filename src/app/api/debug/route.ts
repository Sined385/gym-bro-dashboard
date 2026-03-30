import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET() {
  try {
    const [users, workouts, events, exercises, sampleExercises] = await Promise.all([
      queryOne<{ count: string }>('SELECT count(*) FROM "User"'),
      queryOne<{ count: string }>("SELECT count(*) FROM workout_sessions"),
      queryOne<{ count: string }>("SELECT count(*) FROM analytics_events"),
      queryOne<{ count: string }>("SELECT count(*) FROM exercise_library WHERE is_system = true"),
      query<{ name: string; muscle_group: string }>(
        "SELECT name, muscle_group FROM exercise_library WHERE is_system = true ORDER BY name LIMIT 5"
      ),
    ]);

    return NextResponse.json({
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "missing",
      },
      users: users?.count,
      workouts: workouts?.count,
      events: events?.count,
      system_exercises: exercises?.count,
      sample_exercises: sampleExercises,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
