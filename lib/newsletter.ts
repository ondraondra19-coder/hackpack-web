// lib/newsletter.ts
// Přihlášení k newsletteru = přidání kontaktu do Resend Audience. Samotný sběr
// kontaktů funguje i PŘED ověřením domény (rozesílání kampaní přes Broadcasts
// už ne) — takže seznam odběratelů můžeme začít budovat hned.
//
// Odhlašování neřešíme tady: Resend do každého Broadcastu vloží unsubscribe
// odkaz/hlavičky a odhlášené kontakty z rozesílky sám vynechá.
import { getResendClient } from "./email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 150;

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "not_configured" | "error" };

export function isValidNewsletterEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(trimmed);
}

export async function subscribeToNewsletter(rawEmail: string): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidNewsletterEmail(email)) return { ok: false, reason: "invalid" };

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error("❌ RESEND_AUDIENCE_ID chybí — kontakt se neuloží.");
    return { ok: false, reason: "not_configured" };
  }

  const resend = getResendClient();
  if (!resend) return { ok: false, reason: "not_configured" };

  try {
    const { error } = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });

    // Už existující kontakt Resend hlásí jako chybu — pro nás to není chyba,
    // uživatel prostě "je přihlášený". Navenek to nerozlišujeme: neprozrazovat,
    // jestli e-mail v seznamu už je (ochrana soukromí, žádné enumerování).
    if (error && !/already|exist/i.test(error.message ?? "")) {
      console.error("Resend contacts.create selhalo:", error);
      return { ok: false, reason: "error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("Přihlášení k newsletteru selhalo:", err);
    return { ok: false, reason: "error" };
  }
}
