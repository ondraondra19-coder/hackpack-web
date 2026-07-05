import { redirect } from "next/navigation";

// Recenze teď žijí jako tab přímo v /admin — tahle stránka jen přesměruje,
// ať staré odkazy/záložky na /admin/recenze neskončí 404.
export default function AdminReviewsRedirect() {
  redirect("/admin");
}