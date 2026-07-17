"use client";

import Link from "next/link";

// components/HomeLink.tsx
// Odkaz na homepage, který — když už na homepage jsi — místo přenačtení
// stránky jen plynule odroluje nahoru.
//
// PROČ ZVLÁŠŤ: je to jediná interaktivní věc v jinak statické patičce.
// Kvůli tomuhle handleru byl dřív "use client" na celém Footeru, takže se
// do prohlížeče posílal i všechen statický obsah včetně ikon. Takhle je
// klientský jen tenhle odkaz.

export default function HomeLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/"
      onClick={e => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
