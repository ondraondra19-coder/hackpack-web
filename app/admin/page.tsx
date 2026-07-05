import { redirect } from "next/navigation";
import { getAllReviews } from "@/lib/reviews";
import { getAllAccounts, toPublicAccount } from "@/lib/accounts";
import { getCurrentSession } from "@/lib/session";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic"; // vždy čerstvá data, žádné cachování

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) {
    // Token byl neplatný, nebo odkazoval na mezitím smazaný účet.
    redirect("/admin/login");
  }

  const canSeeReviews = session.isMain || session.permissions.includes("reviews");
  const reviews = canSeeReviews ? await getAllReviews() : [];

  const accounts = session.isMain ? (await getAllAccounts()).map(toPublicAccount) : [];

  return <AdminDashboard session={session} initialReviews={reviews} initialAccounts={accounts} />;
}