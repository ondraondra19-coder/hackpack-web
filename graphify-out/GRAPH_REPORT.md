# Graph Report - hackpack-web  (2026-07-13)

## Corpus Check
- 123 files · ~305,037 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 720 nodes · 1361 edges · 76 communities (37 shown, 39 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `497150ce`
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
- lucide-react Dependency
- next-intl Dependency
- react-dom Dependency
- Stripe.js Dependency
- xlsx Dependency
- PostCSS Config
- next
- stripe
- @upstash/redis
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
- `DashboardHome()` --calls--> `getProductCombinations()`  [EXTRACTED]
  app/admin/DashboardHome.tsx → lib/products.ts
- `ContentPreview()` --calls--> `parseBlogContent()`  [EXTRACTED]
  app/admin/MagazinAdminList.tsx → lib/blog.ts
- `AdminPage()` --indirect_call--> `toPublicAccount()`  [INFERRED]
  app/admin/page.tsx → lib/accounts.ts
- `AdminPage()` --calls--> `getProductsWithPriceOverrides()`  [EXTRACTED]
  app/admin/page.tsx → lib/priceOverrides.ts
- `AdminPage()` --calls--> `getAllReviews()`  [EXTRACTED]
  app/admin/page.tsx → lib/reviews.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Product stock lookup pipeline (customer request to StockBadge render)** — readme_stock_app_produkt_slug_page_tsx, readme_stock_getproductstock, readme_stock_google_sheets_api, readme_stock_components_produktclient_tsx, readme_stock_lookupstock, readme_stock_stockbadge [EXTRACTED 1.00]
- **Alternative Google Sheets authentication strategies** — readme_stock_google_sheets_api, readme_stock_service_account, readme_stock_google_auth_library [INFERRED 0.85]
- **Environment variables required for stock integration** — readme_stock_env_local, readme_stock_google_sheet_id, readme_stock_google_sheets_api_key [EXTRACTED 1.00]

## Communities (76 total, 39 thin omitted)

### Community 0 - "Orders & Checkout Pipeline"
Cohesion: 0.07
Nodes (47): ACTIVE_STATUSES, CURRENCY_SYMBOLS, formatDate(), formatMoney(), OrdersAdminList(), OrdersAdminListProps, PAYMENT_METHOD_LABELS, SHIPPING_PROVIDER_LABELS (+39 more)

### Community 1 - "Admin Accounts & Permissions"
Cohesion: 0.08
Nodes (47): AccountsAdminPanelProps, PERMISSION_LABELS, AdminDashboard(), AdminDashboardProps, getInitials(), AdminPage(), DELETE(), GET() (+39 more)

### Community 2 - "Blog / Magazine CMS"
Cohesion: 0.09
Nodes (36): AdminSearch(), AdminSearchProps, CURRENCY_SYMBOLS, formatMoney(), ContentPreview(), czechDateToInputValue(), EMPTY_FORM, FormState (+28 more)

### Community 3 - "Products, Categories & Stock"
Cohesion: 0.05
Nodes (49): formatPrice(), normalizePrice(), priceEquals(), ProductsAdminList(), ProductsAdminListProps, POST(), PriceEntry, POST() (+41 more)

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
Cohesion: 0.13
Nodes (23): Tab, BarChart(), CURRENCY_LABELS, formatDateShort(), formatMoney(), RankedTable(), SectionCard(), StatCard() (+15 more)

### Community 9 - "Reviews System"
Cohesion: 0.10
Nodes (31): MessagesAdminListProps, ReviewsAdminList(), ReviewsAdminListProps, DELETE(), GET(), PATCH(), requireAccess(), DELETE() (+23 more)

### Community 10 - "Cart Page (Kosik)"
Cohesion: 0.27
Nodes (8): FEATURED_SLUGS, FeaturedProducts(), getVisibleCount(), CURRENCIES, Currency, CurrencyCode, CurrencyContext, CurrencyContextType

### Community 12 - "Homepage"
Cohesion: 0.38
Nodes (5): calcAvg(), formatDate(), Review, ReviewCard(), Reviews()

### Community 13 - "Category Listing & Featured Products"
Cohesion: 0.23
Nodes (8): anyInStock(), Category, KategorieClient(), maxStock(), sortOptions, StockPill(), StoredReview, Product

### Community 14 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 15 - "Product Detail Client"
Cohesion: 0.14
Nodes (8): COLOR_MAP, isLayeredColor(), MediaItem, ProduktClient(), ModelColor, ModelColorLayered, StockData, useStockPolling()

### Community 17 - "Address Lookup API (RUIAN)"
Cohesion: 0.29
Nodes (14): AdresaResult, callRuian(), capitalize(), formatPsc(), GET(), isJunkLokalita(), isMultiPsc(), isSilnaUlice() (+6 more)

### Community 18 - "Static Info Pages & Footer"
Cohesion: 0.18
Nodes (3): footerNav, socialLinks, trustItems

### Community 19 - "Core NPM Dependencies"
Cohesion: 0.13
Nodes (15): google-auth-library, next-intl, dependencies, google-auth-library, next-intl, posthog-js, posthog-node, react (+7 more)

### Community 20 - "Cart State & Discounts"
Cohesion: 0.20
Nodes (14): CartContext, CartCtx, CartItem, CartProvider(), itemKey(), PriceRaw, APPROX_RATES, calcDiscount() (+6 more)

### Community 21 - "Order Form (Objednavka)"
Cohesion: 0.17
Nodes (16): BESTSELLER_SLUGS, COLOR_LABELS, getProductImgs(), KosikPage(), ProductCard(), translateValue(), dopravyOptions, ObjednavkaPage() (+8 more)

### Community 22 - "Product Search Bar"
Cohesion: 0.26
Nodes (13): buildFuse(), CATEGORY_LABELS, ConfidentCard(), expandQuery(), getCategoryLabel(), highlightMatch(), isConfidentResult(), normalize() (+5 more)

### Community 23 - "Order Success Page"
Cohesion: 0.15
Nodes (5): Snapshot, SnapshotInfo, SnapshotItem, SuccessContent(), getPrice()

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
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

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
- **221 isolated node(s):** `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps`, `AdminSearchProps`, `CURRENCY_SYMBOLS` (+216 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getRedis()` connect `Reviews System` to `Orders & Checkout Pipeline`, `Admin Accounts & Permissions`, `Blog / Magazine CMS`, `Products, Categories & Stock`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `getCurrentSession()` connect `Admin Accounts & Permissions` to `Orders & Checkout Pipeline`, `Blog / Magazine CMS`, `Products, Categories & Stock`, `Admin Analytics Dashboard`, `Reviews System`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `Product` connect `Category Listing & Featured Products` to `Admin Accounts & Permissions`, `Blog / Magazine CMS`, `Products, Categories & Stock`, `Admin Analytics Dashboard`, `Cart Page (Kosik)`, `Product Detail Client`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps` to the rest of the system?**
  _221 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Orders & Checkout Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06954997077732321 - nodes in this community are weakly interconnected._
- **Should `Admin Accounts & Permissions` be split into smaller, more focused modules?**
  _Cohesion score 0.07868852459016394 - nodes in this community are weakly interconnected._
- **Should `Blog / Magazine CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._