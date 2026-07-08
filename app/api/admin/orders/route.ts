// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { listOrders } from "@/lib/orders";

// GET /api/admin/orders?limit=50&offset=0
export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }
  if (!session.isMain && !session.permissions.includes("reservations")) {
    return NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);

  try {
    const { orders, total } = await listOrders(limit, offset);
    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ error: "Nepodařilo se načíst objednávky." }, { status: 500 });
  }
}