"use server";

import { redirect } from "next/navigation";
import { setAuthCookie } from "@/lib/auth";

export async function login(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const password = formData.get("password") as string;
  const expected = process.env.DASHBOARD_PASSWORD;

  if (!expected || password !== expected) {
    return "Invalid password";
  }

  await setAuthCookie(password);
  redirect("/");
}
