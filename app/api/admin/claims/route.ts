// app/api/admin/claims/route.ts
// Správa reklamací / vrácení / výměn v adminu. Stejný vzor jako
// /api/admin/messages — chráněné session + oprávněním "claims".
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getAllClaims, setClaimStatus, deleteClaim, CLAIM_STATUSES, type ClaimStatus } from "@/lib/claims";

async function requireAccess() {
  const session = await getCurrentSession();
  if (!session) return { session: null, allowed: false };
  const allowed = session.isMain || session.permissions.includes("claims");
  return { session, allowed };
}

// GET /api/admin/claims — seznam všech žádostí (nejnovější první)
export async function GET() {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  try {
    const claims = await getAllClaims();
    return NextResponse.json({ claims });
  } catch (error) {
    console.error("Admin claims GET error:", error);
    return NextResponse.json({ claims: [], error: "Nepodařilo se načíst reklamace." }, { status: 500 });
  }
}

// PATCH /api/admin/claims — { id, status } — změní stav vyřizování
export async function PATCH(req: Request) {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatné tělo požadavku." }, { status: 400 });
  }

  if (!body.id || !CLAIM_STATUSES.includes(body.status as ClaimStatus)) {
    return NextResponse.json({ error: "Chybí id nebo neplatný stav." }, { status: 400 });
  }

  try {
    const updated = await setClaimStatus(body.id, body.status as ClaimStatus);
    if (!updated) {
      return NextResponse.json({ error: "Žádost nenalezena." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin claims PATCH error:", error);
    return NextResponse.json({ error: "Nepodařilo se upravit žádost." }, { status: 500 });
  }
}

// DELETE /api/admin/claims?id=... — smaže žádost
export async function DELETE(req: Request) {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Chybí id žádosti." }, { status: 400 });
  }

  try {
    const deleted = await deleteClaim(id);
    if (!deleted) {
      return NextResponse.json({ error: "Žádost nenalezena." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin claims DELETE error:", error);
    return NextResponse.json({ error: "Nepodařilo se smazat žádost." }, { status: 500 });
  }
}
