"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function grantPremium(userId: string) {
  await query(
    `UPDATE "User"
     SET is_premium = true,
         premium_source = 'admin',
         premium_granted_at = NOW(),
         premium_expires_at = NULL
     WHERE id = $1`,
    [userId]
  );

  // Track analytics event
  await query(
    `INSERT INTO analytics_events (id, user_id, event_name, properties, created_at)
     VALUES (gen_random_uuid(), $1, 'premium_activated', '{"source": "admin"}'::jsonb, NOW())`,
    [userId]
  );

  revalidatePath(`/users/${userId}`);
  revalidatePath("/");
}

export async function revokePremium(userId: string) {
  // Only revoke admin-granted premium
  const result = await query<{ premium_source: string | null }>(
    `SELECT premium_source FROM "User" WHERE id = $1`,
    [userId]
  );

  if (!result[0] || result[0].premium_source !== "admin") {
    return { error: "Can only revoke admin-granted premium" };
  }

  await query(
    `UPDATE "User"
     SET is_premium = false,
         premium_source = NULL,
         premium_granted_at = NULL,
         premium_expires_at = NULL
     WHERE id = $1`,
    [userId]
  );

  // Track analytics event
  await query(
    `INSERT INTO analytics_events (id, user_id, event_name, properties, created_at)
     VALUES (gen_random_uuid(), $1, 'premium_revoked', '{"source": "admin"}'::jsonb, NOW())`,
    [userId]
  );

  revalidatePath(`/users/${userId}`);
  revalidatePath("/");
}
