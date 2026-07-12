// lib/posthog-server.ts
// Server-only PostHog klient pro capture() volání (např. ze Stripe webhooku).
// Serverless prostředí (Vercel) může proces ukončit hned po odpovědi, proto
// se u volajícího VŽDY čeká na client.shutdown() — to zajistí odeslání
// eventů před koncem requestu (flushAt/flushInterval jsou proto vypnuté,
// posílá se ihned při shutdownu).
import { PostHog } from "posthog-node";

export function createPostHogServerClient(): PostHog | null {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!apiKey || !host) return null;

  return new PostHog(apiKey, { host, flushAt: 1, flushInterval: 0 });
}
