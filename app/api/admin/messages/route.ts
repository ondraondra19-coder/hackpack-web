// app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getAllMessages, markMessageRead, deleteMessage } from "@/lib/messages";

async function requireAccess() {
  const session = await getCurrentSession();
  if (!session) return { session: null, allowed: false };
  const allowed = session.isMain || session.permissions.includes("messages");
  return { session, allowed };
}

// GET /api/admin/messages — seznam všech zpráv (nejnovější první)
export async function GET() {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  try {
    const messages = await getAllMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Admin messages GET error:", error);
    return NextResponse.json({ messages: [], error: "Nepodařilo se načíst zprávy." }, { status: 500 });
  }
}

// PATCH /api/admin/messages — { id, read } — označí zprávu jako přečtenou/nepřečtenou
export async function PATCH(req: Request) {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  let body: { id?: string; read?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatné tělo požadavku." }, { status: 400 });
  }

  if (!body.id || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Chybí id nebo stav přečtení." }, { status: 400 });
  }

  try {
    const updated = await markMessageRead(body.id, body.read);
    if (!updated) {
      return NextResponse.json({ error: "Zpráva nenalezena." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin messages PATCH error:", error);
    return NextResponse.json({ error: "Nepodařilo se upravit zprávu." }, { status: 500 });
  }
}

// DELETE /api/admin/messages?id=... — smaže zprávu
export async function DELETE(req: Request) {
  const { allowed } = await requireAccess();
  if (!allowed) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Chybí id zprávy." }, { status: 400 });
  }

  try {
    const deleted = await deleteMessage(id);
    if (!deleted) {
      return NextResponse.json({ error: "Zpráva nenalezena." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin messages DELETE error:", error);
    return NextResponse.json({ error: "Nepodařilo se smazat zprávu." }, { status: 500 });
  }
}