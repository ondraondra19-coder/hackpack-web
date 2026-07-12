// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_HINT_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_HINT_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}