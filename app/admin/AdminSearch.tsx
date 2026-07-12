"use client";

// app/admin/AdminSearch.tsx
// Hledání v horní liště administrace — dřív jen dekorativní <input> bez logiky.
// Prohledává produkty (vždy po ruce v paměti), objednávky a magazín (dotažené
// líně, až při prvním smysluplném dotazu, přes existující admin API routy).
// Fuzzy matching přes Fuse.js — tolerantní k překlepům, stejně jako SearchBar.tsx na webu.

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search, X, Package, ShoppingBag, Newspaper } from "lucide-react";
import type { Product } from "@/lib/products";
import type { Order } from "@/lib/orders";
import type { BlogPost } from "@/lib/blog";

type AdminSearchProps = {
  products: Product[];
  canSeeOrders: boolean;
  canSeeMagazin: boolean;
  onSelectProduct: (product: Product) => void;
  onSelectOrder: (order: Order) => void;
  onSelectPost: (post: BlogPost) => void;
};

const CURRENCY_SYMBOLS: Record<string, string> = { CZK: "Kč", EUR: "€", USD: "$" };

function formatMoney(amount: number, currency: string): string {
  return `${Math.round(amount).toLocaleString("cs-CZ")} ${CURRENCY_SYMBOLS[currency] ?? currency}`;
}

export default function AdminSearch({
  products,
  canSeeOrders,
  canSeeMagazin,
  onSelectProduct,
  onSelectOrder,
  onSelectPost,
}: AdminSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl/Cmd+K fokusne hledání odkudkoliv v adminu — obvyklý vzor u nástrojů
  // jako Stripe/Linear/Notion.
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 150);
    return () => clearTimeout(id);
  }, [query]);

  // Líný fetch — objednávky a magazín se natáhnou až při prvním dotazu, ne
  // hned při načtení adminu (většina návštěv adminu hledání vůbec nepoužije).
  useEffect(() => {
    if (debouncedQuery.length < 2) return;
    if (canSeeOrders && orders === null) {
      fetch("/api/admin/orders?limit=200", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : { orders: [] }))
        .then((data) => setOrders(data.orders ?? []))
        .catch(() => setOrders([]));
    }
    if (canSeeMagazin && posts === null) {
      fetch("/api/admin/blog", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : { posts: [] }))
        .then((data) => setPosts(data.posts ?? []))
        .catch(() => setPosts([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, canSeeOrders, canSeeMagazin]);

  const productsFuse = useMemo(
    () => new Fuse(products, { keys: [{ name: "name", weight: 2 }, "tags", "slug"], threshold: 0.4, ignoreLocation: true }),
    [products]
  );
  const ordersFuse = useMemo(
    () => new Fuse(orders ?? [], { keys: [{ name: "customer.jmeno", weight: 2 }, "customer.email", "id"], threshold: 0.35, ignoreLocation: true }),
    [orders]
  );
  const postsFuse = useMemo(
    () => new Fuse(posts ?? [], { keys: [{ name: "title", weight: 2 }, "excerpt"], threshold: 0.35, ignoreLocation: true }),
    [posts]
  );

  const showDropdown = open && debouncedQuery.length >= 2;

  const productResults = showDropdown ? productsFuse.search(debouncedQuery).slice(0, 4).map((r) => r.item) : [];
  const orderResults = showDropdown ? ordersFuse.search(debouncedQuery).slice(0, 4).map((r) => r.item) : [];
  const postResults = showDropdown ? postsFuse.search(debouncedQuery).slice(0, 3).map((r) => r.item) : [];

  const totalResults = productResults.length + orderResults.length + postResults.length;
  const loadingExtra = showDropdown && ((canSeeOrders && orders === null) || (canSeeMagazin && posts === null));

  function select(fn: () => void) {
    fn();
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative hidden sm:block sm:w-48 lg:w-72">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
        <Search size={15} />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Hledat v administraci…"
        autoComplete="off"
        spellCheck={false}
        className="w-full bg-[#f1f1f3] border border-[#e5e7eb] rounded-xl pl-9 pr-9 py-2 text-xs text-[#0f0f10] placeholder-zinc-400 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
      />
      {query ? (
        <button
          onClick={() => { setQuery(""); inputRef.current?.focus(); }}
          aria-label="Vymazat hledání"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#0f0f10] transition-colors"
        >
          <X size={13} />
        </button>
      ) : (
        <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center text-[10px] font-mono text-zinc-400 border border-zinc-200 rounded px-1 py-0.5">
          ⌘K
        </kbd>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
          {totalResults === 0 && !loadingExtra ? (
            <p className="px-4 py-6 text-center text-xs text-zinc-400">Nic jsem nenašel pro „{debouncedQuery}“.</p>
          ) : (
            <>
              {productResults.length > 0 && (
                <div className="py-1.5">
                  <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Package size={11} /> Produkty
                  </p>
                  {productResults.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => select(() => onSelectProduct(p))}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2 text-left text-xs hover:bg-[#f7f6f4] transition-colors"
                    >
                      <span className="text-[#0f0f10] font-medium truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {canSeeOrders && orderResults.length > 0 && (
                <div className="py-1.5 border-t border-zinc-100">
                  <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <ShoppingBag size={11} /> Objednávky
                  </p>
                  {orderResults.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => select(() => onSelectOrder(o))}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2 text-left text-xs hover:bg-[#f7f6f4] transition-colors"
                    >
                      <span className="text-[#0f0f10] font-medium truncate">{o.customer.jmeno || "Bez jména"}</span>
                      <span className="text-zinc-400 shrink-0">{formatMoney(o.total, o.currency)}</span>
                    </button>
                  ))}
                </div>
              )}

              {canSeeMagazin && postResults.length > 0 && (
                <div className="py-1.5 border-t border-zinc-100">
                  <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Newspaper size={11} /> Magazín
                  </p>
                  {postResults.map((post) => (
                    <button
                      key={post.slug}
                      onClick={() => select(() => onSelectPost(post))}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2 text-left text-xs hover:bg-[#f7f6f4] transition-colors"
                    >
                      <span className="text-[#0f0f10] font-medium truncate">{post.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {loadingExtra && totalResults === 0 && (
                <p className="px-4 py-3 text-[11px] text-zinc-400">Prohledávám objednávky a magazín…</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
