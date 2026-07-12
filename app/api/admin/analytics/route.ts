// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getAnalyticsSummary } from "@/lib/posthog-query";

// GET /api/admin/analytics?days=30 — vrátí souhrn statistik pro admin panel.
// Musí být přihlášený A mít oprávnění "analytics" (hlavní účet má vždy).
export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }
  if (!session.isMain && !session.permissions.includes("analytics")) {
    return NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const daysParam = parseInt(searchParams.get("days") ?? "30", 10);
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;

  try {
    const summary = await getAnalyticsSummary(days);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json({ error: "Nepodařilo se načíst statistiky." }, { status: 500 });
  }
}