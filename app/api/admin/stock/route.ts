// app/api/admin/stock/route.ts
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { setStockBulk } from "@/lib/stock";

type StockEntryInput = { slug?: string; color?: string; size?: string; value?: number };

// POST /api/admin/stock — hromadně uloží skladovost pro více variant najednou.
// Tělo: { entries: [{ slug, color?, size?, value }, ...] }
// Musí být přihlášený A mít oprávnění "products" (hlavní účet má vždy).
export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }
  if (!session.isMain && !session.permissions.includes("products")) {
    return NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 });
  }

  let body: { entries?: StockEntryInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatné tělo požadavku." }, { status: 400 });
  }

  const entries = body.entries;
  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "Chybí seznam změn." }, { status: 400 });
  }

  const parsed: { key: { slug: string; color?: string; size?: string }; value: number }[] = [];
  for (const entry of entries) {
    if (!entry.slug || typeof entry.value !== "number" || !Number.isFinite(entry.value)) {
      return NextResponse.json({ error: "Neplatná položka v seznamu změn." }, { status: 400 });
    }
    parsed.push({ key: { slug: entry.slug, color: entry.color, size: entry.size }, value: entry.value });
  }

  try {
    await setStockBulk(parsed);
    return NextResponse.json({ success: true, count: parsed.length });
  } catch (error) {
    console.error("Admin stock bulk POST error:", error);
    return NextResponse.json({ error: "Nepodařilo se uložit sklad." }, { status: 500 });
  }
}