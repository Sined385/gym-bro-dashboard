"use server";

import { query, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

const ALLOWED_DURATIONS = new Set([7, 30, 90, 365]);
const CODE_PATTERN = /^[A-Z0-9_-]{3,64}$/;

export async function createPromoCode(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  const durationDays = parseInt(String(formData.get("duration_days") ?? ""));
  const expiresAt = String(formData.get("expires_at") ?? "");

  if (!CODE_PATTERN.test(code)) {
    return "Code must be 3-64 characters: letters, numbers, - or _";
  }
  if (!ALLOWED_DURATIONS.has(durationDays)) {
    return "Invalid duration";
  }
  const expiry = new Date(`${expiresAt}T23:59:59`);
  if (isNaN(expiry.getTime()) || expiry <= new Date()) {
    return "Expiration date must be in the future";
  }

  const inserted = await queryOne<{ id: string }>(
    `INSERT INTO promo_codes (code, duration_days, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (code) DO NOTHING
     RETURNING id`,
    [code, durationDays, expiry.toISOString()]
  );
  if (!inserted) {
    return "A code with this name already exists";
  }

  revalidatePath("/promo-codes");
  return null;
}

export async function deactivatePromoCode(id: string) {
  await query(`UPDATE promo_codes SET is_active = false WHERE id = $1`, [id]);
  revalidatePath("/promo-codes");
}
