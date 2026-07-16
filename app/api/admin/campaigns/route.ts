// app/api/admin/campaigns/route.ts
// GET  — kontext pro panel (počet odběratelů, poslední kampaně).
// POST — rozešle novou kampaň na celou Audience přes Resend Broadcasts.
// Vyžaduje přihlášení A oprávnění "campaigns" (hlavní účet má vždy).
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getCampaignContext, sendCampaign } from "@/lib/campaigns";

async function requirePermission() {
  const session = await getCurrentSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Neautorizováno." }, { status: 401 }) };
  }
  if (!session.isMain && !session.permissions.includes("campaigns")) {
    return { error: NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const { error } = await requirePermission();
  if (error) return error;

  try {
    const context = await getCampaignContext();
    return NextResponse.json(context);
  } catch (err) {
    console.error("Admin campaigns GET error:", err);
    return NextResponse.json({ error: "Nepodařilo se načíst přehled kampaní." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requirePermission();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const subject = body?.subject;
  const previewText = body?.previewText;
  const text = body?.body;

  if (typeof subject !== "string" || typeof text !== "string") {
    return NextResponse.json({ error: "Chybí předmět nebo text kampaně." }, { status: 400 });
  }

  const result = await sendCampaign({
    subject,
    previewText: typeof previewText === "string" ? previewText : undefined,
    body: text,
  });

  if (!result.ok) {
    // Neověřená doména není chyba serveru — je to očekávaný stav před spuštěním,
    // vracíme 400 s čitelnou hláškou (panel podle reason ukáže návod).
    const status = result.reason === "error" || result.reason === "not_configured" ? 500 : 400;
    return NextResponse.json({ error: result.message, reason: result.reason }, { status });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
