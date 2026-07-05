// app/api/admin/reviews/route.ts
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { deleteReview } from "@/lib/reviews";

// DELETE /api/admin/reviews?id=... — smaže recenzi
// Musí být přihlášený A mít oprávnění "reviews" (hlavní účet má vždy).
export async function DELETE(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }
  if (!session.isMain && !session.permissions.includes("reviews")) {
    return NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Chybí id recenze." }, { status: 400 });
  }

  try {
    const deleted = await deleteReview(id);
    if (!deleted) {
      return NextResponse.json({ error: "Recenze s tímto id nenalezena." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reviews DELETE error:", error);
    return NextResponse.json({ error: "Nepodařilo se smazat recenzi." }, { status: 500 });
  }
}