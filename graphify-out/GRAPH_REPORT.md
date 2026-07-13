# Graph Report - hackpack-web  (2026-07-14)

## Corpus Check
- 124 files · ~305,889 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 729 nodes · 1374 edges · 70 communities (38 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3167e388`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Orders & Checkout Pipeline
- Admin Accounts & Permissions
- Blog / Magazine CMS
- Products, Categories & Stock
- TypeScript Config & Refs
- Docs: READMEs & Stock Setup Guide
- Address Autocomplete Form
- Root Layout & Consent Tracking
- Admin Analytics Dashboard
- Reviews System
- Cart Page (Kosik)
- Admin Authentication
- Homepage
- Category Listing & Featured Products
- Dev Tooling Dependencies
- Product Detail Client
- Contact Messages
- Address Lookup API (RUIAN)
- Static Info Pages & Footer
- Core NPM Dependencies
- Cart State & Discounts
- Order Form (Objednavka)
- Product Search Bar
- Order Success Page
- Privacy Policy, Header & Logo
- Localization Context (i18n)
- Complaints / Returns Page
- NPM Scripts
- Admin Products List
- Shipping & Payment Info Page
- Write a Review Page
- Product Export Script
- Product Update Script
- FAQ Page
- Terms & Conditions Page
- Manual Translations Hook
- Instagram Feed Component
- i18n Request/Routing Config
- Next.js Config
- ESLint Config
- next-intl Dependency
- Stripe.js Dependency
- PostCSS Config
- app/page.tsx (entry page)
- create-next-app (bootstrap tool)
- Geist (Vercel font family)
- next/font (font optimization)
- Next.js (framework)
- app/api/stock/route.ts (client refresh endpoint)
- app/produkt/[slug]/page.tsx (server component)
- CACHE_TTL (3-minute cache mechanism)
- components/ProduktClient.tsx (client component)
- .env.local environment configuration
- google-auth-library (npm package)
- GOOGLE_SHEET_ID (env var)
- Google Sheet "Sklad" (stock data source)
- Google Sheets API
- GOOGLE_SHEETS_API_KEY (env var)
- lib/stock.ts (fetch + cache logic)
- products.ts (product slug/color/size source of truth)
- Service Account auth (private sheet alternative)
- StockBadge (UI component)
- Vercel (company/creator of Next.js)
- Vercel Platform (deployment target)

## God Nodes (most connected - your core abstractions)
1. `getRedis()` - 41 edges
2. `getCurrentSession()` - 27 edges
3. `useCurrency()` - 21 edges
4. `formatPrice()` - 21 edges
5. `getPrice()` - 20 edges
6. `getProductsWithPriceOverrides()` - 17 edges
7. `compilerOptions` - 16 edges
8. `getAllPosts()` - 14 edges
9. `useCart()` - 13 edges
10. `SearchBar()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `ContentPreview()` --calls--> `parseBlogContent()`  [EXTRACTED]
  app/admin/MagazinAdminList.tsx → lib/blog.ts
- `AdminPage()` --indirect_call--> `toPublicAccount()`  [INFERRED]
  app/admin/page.tsx → lib/accounts.ts
- `AdminPage()` --calls--> `getProductsWithPriceOverrides()`  [EXTRACTED]
  app/admin/page.tsx → lib/priceOverrides.ts
- `AdminPage()` --calls--> `getStockMap()`  [EXTRACTED]
  app/admin/page.tsx → lib/stock.ts
- `GET()` --indirect_call--> `toPublicAccount()`  [INFERRED]
  app/api/admin/accounts/route.ts → lib/accounts.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Product stock lookup pipeline (customer request to StockBadge render)** — readme_stock_app_produkt_slug_page_tsx, readme_stock_getproductstock, readme_stock_google_sheets_api, readme_stock_components_produktclient_tsx, readme_stock_lookupstock, readme_stock_stockbadge [EXTRACTED 1.00]
- **Alternative Google Sheets authentication strategies** — readme_stock_google_sheets_api, readme_stock_service_account, readme_stock_google_auth_library [INFERRED 0.85]
- **Environment variables required for stock integration** — readme_stock_env_local, readme_stock_google_sheet_id, readme_stock_google_sheets_api_key [EXTRACTED 1.00]

## Communities (70 total, 32 thin omitted)

### Community 0 - "Orders & Checkout Pipeline"
Cohesion: 0.06
Nodes (51): ACTIVE_STATUSES, CURRENCY_SYMBOLS, formatDate(), formatMoney(), OrdersAdminList(), OrdersAdminListProps, PAYMENT_METHOD_LABELS, SHIPPING_PROVIDER_LABELS (+43 more)

### Community 1 - "Admin Accounts & Permissions"
Cohesion: 0.06
Nodes (65): AccountsAdminPanelProps, PERMISSION_LABELS, AdminDashboard(), AdminDashboardProps, getInitials(), Tab, MessagesAdminListProps, AdminPage() (+57 more)

### Community 2 - "Blog / Magazine CMS"
Cohesion: 0.09
Nodes (36): AdminSearch(), AdminSearchProps, CURRENCY_SYMBOLS, formatMoney(), ContentPreview(), czechDateToInputValue(), EMPTY_FORM, FormState (+28 more)

### Community 3 - "Products, Categories & Stock"
Cohesion: 0.07
Nodes (32): POST(), PriceEntry, POST(), StockEntryInput, GET(), GET(), KategoriePage(), Home() (+24 more)

### Community 4 - "TypeScript Config & Refs"
Cohesion: 0.06
Nodes (30): ./*, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 5 - "Docs: READMEs & Stock Setup Guide"
Cohesion: 0.17
Nodes (11): 1. Vytvoř Google Sheet, 2. Google Sheets API klíč (pro veřejný sheet), 3. (Alternativa) Service Account pro soukromý sheet, 4. Environment variables, 5. Soubory do projektu, 6. Jak to funguje, 7. Jak editovat skladovost, 8. Přidání nového produktu / kombinace (+3 more)

### Community 6 - "Address Autocomplete Form"
Cohesion: 0.11
Nodes (18): AddressBlock, AddressErrors, AdresaResult, cacheAdresa, cacheMesto, defaultForm(), emptyAddress(), formatPhone() (+10 more)

### Community 7 - "Root Layout & Consent Tracking"
Cohesion: 0.19
Nodes (16): geistMono, geistSans, metadata, viewport, CookieBanner(), getConsent(), hasAnalyticsConsent(), capturePageview() (+8 more)

### Community 8 - "Admin Analytics Dashboard"
Cohesion: 0.11
Nodes (28): BarChart(), CURRENCY_LABELS, formatDateShort(), formatMoney(), RankedTable(), SectionCard(), StatCard(), AnalyticsPanel() (+20 more)

### Community 9 - "Reviews System"
Cohesion: 0.20
Nodes (14): normalizeName(), POST(), ADMIN_COOKIE_NAME, ADMIN_HINT_COOKIE_NAME, bufToHex(), checkPassword(), createSessionToken(), getKey() (+6 more)

### Community 10 - "Cart Page (Kosik)"
Cohesion: 0.43
Nodes (5): CURRENCIES, Currency, CurrencyCode, CurrencyContext, CurrencyContextType

### Community 12 - "Homepage"
Cohesion: 0.38
Nodes (5): calcAvg(), formatDate(), Review, ReviewCard(), Reviews()

### Community 13 - "Category Listing & Featured Products"
Cohesion: 0.23
Nodes (8): anyInStock(), Category, KategorieClient(), maxStock(), sortOptions, StockPill(), StoredReview, Product

### Community 14 - "Dev Tooling Dependencies"
Cohesion: 0.07
Nodes (27): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+19 more)

### Community 15 - "Product Detail Client"
Cohesion: 0.09
Nodes (14): COLOR_MAP, isLayeredColor(), MediaItem, ProduktClient(), MediaItem, ModelColor, ModelColorLayered, ProductColor (+6 more)

### Community 16 - "Contact Messages"
Cohesion: 0.28
Nodes (6): BESTSELLER_SLUGS, COLOR_LABELS, getProductImgs(), KosikPage(), translateValue(), products

### Community 17 - "Address Lookup API (RUIAN)"
Cohesion: 0.29
Nodes (14): AdresaResult, callRuian(), capitalize(), formatPsc(), GET(), isJunkLokalita(), isMultiPsc(), isSilnaUlice() (+6 more)

### Community 18 - "Static Info Pages & Footer"
Cohesion: 0.13
Nodes (4): metadata, footerNav, socialLinks, trustItems

### Community 19 - "Core NPM Dependencies"
Cohesion: 0.07
Nodes (27): fuse.js, google-auth-library, lucide-react, next, next-intl, dependencies, fuse.js, google-auth-library (+19 more)

### Community 20 - "Cart State & Discounts"
Cohesion: 0.20
Nodes (13): CartContext, CartCtx, CartItem, CartProvider(), itemKey(), PriceRaw, APPROX_RATES, calcDiscount() (+5 more)

### Community 21 - "Order Form (Objednavka)"
Cohesion: 0.26
Nodes (10): dopravyOptions, ObjednavkaPage(), PacketaPoint, platbyOptions, Window, DiscountWidget(), useCart(), useCurrency() (+2 more)

### Community 22 - "Product Search Bar"
Cohesion: 0.26
Nodes (13): buildFuse(), CATEGORY_LABELS, ConfidentCard(), expandQuery(), getCategoryLabel(), highlightMatch(), isConfidentResult(), normalize() (+5 more)

### Community 23 - "Order Success Page"
Cohesion: 0.12
Nodes (10): BankovniPrevod(), Snapshot, SnapshotInfo, SnapshotItem, buildSpdString(), COMBINING_MARKS, QrPlatbaInput, stripDiacritics() (+2 more)

### Community 24 - "Privacy Policy, Header & Logo"
Cohesion: 0.25
Nodes (10): Header(), languages, navRight, readLangFromCookie(), switchGoogleTranslate(), InfoGrid(), Logo(), useLang() (+2 more)

### Community 25 - "Localization Context (i18n)"
Cohesion: 0.50
Nodes (4): LangContext, LangProvider(), Locale, readLocale()

### Community 26 - "Complaints / Returns Page"
Cohesion: 0.22
Nodes (4): defaultForm, FormState, returnMethods, steps

### Community 27 - "NPM Scripts"
Cohesion: 0.43
Nodes (7): ProductCard(), SuccessContent(), FEATURED_SLUGS, FeaturedProducts(), getVisibleCount(), formatPrice(), getPrice()

### Community 29 - "Shipping & Payment Info Page"
Cohesion: 0.29
Nodes (4): benefits, metadata, paymentMethods, shippingMethods

### Community 30 - "Write a Review Page"
Cohesion: 0.38
Nodes (6): calcStats(), formatDate(), RecenzePage(), Review, ReviewCard(), Window

### Community 31 - "Product Export Script"
Cohesion: 0.29
Nodes (6): content, require, rows, wb, ws, xlsx

### Community 32 - "Product Update Script"
Cohesion: 0.29
Nodes (6): notFound, productsContent, require, rows, workbook, xlsx

### Community 34 - "Terms & Conditions Page"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **225 isolated node(s):** `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps`, `AdminSearchProps`, `CURRENCY_SYMBOLS` (+220 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core NPM Dependencies` to `Dev Tooling Dependencies`, `Order Success Page`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Order Success Page` to `Core NPM Dependencies`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **What connects `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Orders & Checkout Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06346153846153846 - nodes in this community are weakly interconnected._
- **Should `Admin Accounts & Permissions` be split into smaller, more focused modules?**
  _Cohesion score 0.05854341736694678 - nodes in this community are weakly interconnected._
- **Should `Blog / Magazine CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `Products, Categories & Stock` be split into smaller, more focused modules?**
  _Cohesion score 0.0726950354609929 - nodes in this community are weakly interconnected._