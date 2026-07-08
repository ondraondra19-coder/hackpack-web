// app/api/track/route.ts
// Přijímá beacon o návštěvě webu — voláno JEDNOU za relaci prohlížeče
// (ne při každém překliknutí). Klient (AnalyticsTracker) tohle volá
// VÝHRADNĚ pokud uživatel odsouhlasil "Analytické cookies" — bez souhlasu
// se tento endpoint vůbec nezavolá.
import { NextResponse } from "next/server";
import { deviceCategory, referrerDomain, trackVisit } from "@/lib/analytics";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const landingPath: string = typeof body?.path === "string" ? body.path : "/";

    const userAgent = req.headers.get("user-agent") ?? "";
    const ownHost = req.headers.get("host") ?? "";

    const device = deviceCategory(userAgent);
    const refHost = referrerDomain(body?.referrer, ownHost);

    await trackVisit({
      landingPath: landingPath.slice(0, 200), // pojistka proti extrémně dlouhým hodnotám
      device,
      referrerHost: refHost,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Tracking nesmí nikdy shodit stránku uživateli — tiše selžeme.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}