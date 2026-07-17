// app/api/checkout/session/route.ts
// Děkovná stránka po platbě kartou tohle volá se session_id ze Stripe
// redirectu, aby zobrazila SKUTEČNÁ data transakce — ne to, co náhodou
// leží v localStorage prohlížeče (to způsobovalo záměnu se starými
// objednávkami).
//
// Vrací data z naší uložené objednávky (přesná adresa, kontakt, položky —
// to Stripe session sama o sobě nemá, protože adresu sbíráme na vlastní
// stránce). Funguje i bez nakonfigurovaného webhooku: pokud objednávka
// ještě není "potvrzená" (webhook nedoběhl / není nastavený), spadneme
// zpět na "pending" verzi — je to stejná data, jen ještě nepovýšená.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrder, getPendingOrder, type Order } from "@/lib/orders";

export async function GET(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Platby nejsou nakonfigurovány." }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Chybí session_id." }, { status: 400 });
  }

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false }, { status: 200 });
    }

    const pendingOrderId = session.metadata?.pending_order_id;
    let order: Order | null = null;
    let status: "confirmed" | "pending_webhook" | "unknown" = "unknown";

    if (pendingOrderId) {
      // Nejdřív zkusíme potvrzenou verzi (webhook už doběhl).
      order = await getOrder(pendingOrderId);
      if (order) {
        status = "confirmed";
      } else {
        // Webhook ještě neproběhl (nebo není nastavený) — ukážeme pending data.
        const pending = await getPendingOrder(pendingOrderId);
        if (pending) {
          order = { ...pending, id: pendingOrderId, createdAt: Date.now(), status: "nova", paymentStatus: "zaplaceno" } as Order;
          status = "pending_webhook";
        }
      }
    }

    return NextResponse.json({
      paid: true,
      amountTotal: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "czk").toUpperCase(),
      order,
      status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chyba při ověřování Stripe session:", message);
    return NextResponse.json({ error: "Nepodařilo se ověřit platbu." }, { status: 500 });
  }
}