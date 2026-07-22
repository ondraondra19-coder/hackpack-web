import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { isMagazineEnabled } from "@/lib/featureFlags";
import BlogList from "@/components/BlogList";

export const dynamic = "force-dynamic";

// Načtení článků zůstává na serveru, vykreslení je v BlogList — nadpisy sekce
// potřebují jazyk, a ten je na klientovi (viz lib/locale.ts).
//
// Samotné články zůstávají v jazyce, ve kterém je napsal admin. Překládat je
// by znamenalo psát každý článek třikrát; to je redakční rozhodnutí.
export default async function BlogPage() {
  // Magazín je dočasně skrytý (viz isMagazineEnabled) — stránka se tváří jako 404.
  if (!isMagazineEnabled()) notFound();

  // getAllPosts() už vrací seřazeno od nejnovějšího.
  const posts = await getAllPosts();

  return (
    <>
      <Header />
      <BlogList posts={posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, img: p.img }))} />
      <Footer />
    </>
  );
}
