// app/api/messages/route.ts
// Veřejný endpoint — přijímá zprávy z ChatWidgetu na e-shopu.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addMessage, checkAndSetCooldown } from "@/lib/messages";

const MAX_TEXT_LENGTH = 1000;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 150;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cookie identifikující konkrétní prohlížeč/zařízení — cooldown se váže na tohle,
// stejně jako u recenzí, ne na IP adresu.
const DEVICE_COOKIE_NAME = "msg_device_id";
const DEVICE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 rok

// POST /api/messages — odeslání zprávy z chat widgetu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, text, captchaToken } = body ?? {};

    // ── Validace vstupu ────────────────────────────────────────────────────
    if (typeof name !== "string" || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "Neplatné jméno." }, { status: 400 });
    }
    if (
      typeof email !== "string" ||
      !email.trim() ||
      email.trim().length > MAX_EMAIL_LENGTH ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json({ error: "Neplatný email." }, { status: 400 });
    }
    if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "Zpráva je prázdná nebo příliš dlouhá." }, { status: 400 });
    }
    if (typeof captchaToken !== "string" || !captchaToken) {
      return NextResponse.json({ error: "Chybí ověření captcha." }, { status: 400 });
    }

    // ── Server-side ověření hCaptcha ───────────────────────────────────────
    const secret = process.env.HCAPTCHA_SECRET;
    if (!secret) {
      console.error("❌ CHYBÍ HCAPTCHA_SECRET v env proměnných.");
      return NextResponse.json({ error: "Captcha nelze ověřit (chybí konfigurace serveru)." }, { status: 500 });
    }

    const verifyRes = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: captchaToken }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return NextResponse.json({ error: "Ověření captcha se nezdařilo." }, { status: 400 });
    }

    // ── Identifikace zařízení (cookie, ne IP) ──────────────────────────────
    const cookieStore = await cookies();
    let deviceId = cookieStore.get(DEVICE_COOKIE_NAME)?.value;
    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }
    cookieStore.set(DEVICE_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE_SECONDS,
    });

    // ── Anti-spam: 1 zpráva / zařízení / 5 minut ───────────────────────────
    const { allowed, ttlSeconds } = await checkAndSetCooldown(deviceId);
    if (!allowed) {
      const minutes = Math.max(1, Math.ceil(ttlSeconds / 60));
      return NextResponse.json(
        { error: `Další zprávu můžete odeslat za ${minutes} min.` },
        { status: 429 }
      );
    }

    await addMessage({ name: name.trim(), email: email.trim(), text: text.trim() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Nepodařilo se odeslat zprávu." }, { status: 500 });
  }
}