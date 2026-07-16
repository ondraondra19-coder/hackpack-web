// app/api/newsletter/route.ts
// Veřejný endpoint — přihlášení k odběru novinek z formuláře v patičce.
// Kontakt se ukládá do Resend Audience (viz lib/newsletter.ts).
import { NextResponse } from "next/server";
import { subscribeToNewsletter, isValidNewsletterEmail } from "@/lib/newsletter";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/clientIp";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;

    if (!isValidNewsletterEmail(email)) {
      return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 400 });
    }

    // Bránit zaplavení Audience skriptem — 5 přihlášení z jedné IP za hodinu
    // stačí i pro celou rodinu na stejné síti.
    const ip = getClientIp(req);
    if (!(await checkRateLimit(`newsletter:${ip}`, 5, 3600))) {
      return NextResponse.json(
        { error: "Příliš mnoho pokusů. Zkuste to prosím později." },
        { status: 429 },
      );
    }

    const result = await subscribeToNewsletter(email);
    if (!result.ok) {
      // not_configured = chybí RESEND_AUDIENCE_ID (např. před dokončením
      // nastavení). Ať to při testování poznáme, vracíme čitelnou chybu místo
      // tichého "úspěchu", který by kontakt zahodil.
      if (result.reason === "not_configured") {
        return NextResponse.json(
          { error: "Přihlášení k odběru zatím není k dispozici." },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Přihlášení se nezdařilo. Zkuste to prosím znovu." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter POST error:", err);
    return NextResponse.json({ error: "Přihlášení se nezdařilo." }, { status: 500 });
  }
}
