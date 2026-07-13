// app/api/admin/orders/[id]/shipment/route.ts
// POST — vytvoří zásilku u dopravce přiřazeného k objednávce (order.shippingProviderId)
// a uloží tracking číslo / štítek k objednávce. Dopravci bez API přístupů
// (viz lib/shipping/*) vrátí čitelnou chybu místo tichého selhání.
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getOrder, setOrderShipment } from "@/lib/orders";
import { getShippingProvider, ShippingProviderNotConfiguredError } from "@/lib/shipping";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }
  if (!session.isMain && !session.permissions.includes("reservations")) {
    return NextResponse.json({ error: "Nemáte oprávnění k této akci." }, { status: 403 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena." }, { status: 404 });
  }
  if (!order.shippingProviderId) {
    return NextResponse.json({ error: "U této objednávky není rozpoznaný dopravce pro API vytvoření zásilky." }, { status: 400 });
  }
  if (order.shipment) {
    return NextResponse.json({ error: "Zásilka už byla u dopravce vytvořena." }, { status: 409 });
  }

  try {
    const provider = getShippingProvider(order.shippingProviderId);
    const result = await provider.createShipment(order);
    const updated = await setOrderShipment(id, {
      provider: order.shippingProviderId,
      carrierShipmentId: result.carrierShipmentId,
      trackingNumber: result.trackingNumber,
      labelUrl: result.labelUrl,
      createdAt: Date.now(),
    });
    return NextResponse.json({ order: updated });
  } catch (err) {
    if (err instanceof ShippingProviderNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 501 });
    }
    console.error("Chyba při vytváření zásilky:", err);
    const message = err instanceof Error ? err.message : "Vytvoření zásilky se nezdařilo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
