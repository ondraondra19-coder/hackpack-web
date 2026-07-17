# Graph Report - hackpack-web  (2026-07-16)

## Corpus Check
- 145 files · ~321,015 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 878 nodes · 1883 edges · 75 communities (42 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27dec035`
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
- discountsStore.ts
- Order Form (Objednavka)
- Product Search Bar
- dependencies
- reviews.ts
- priceOverrides.ts
- index.ts
- KategorieClient.tsx
- orders.ts
- package.json
- route.ts
- Product Export Script
- Product Update Script
- Reviews.tsx
- Terms & Conditions Page
- Manual Translations Hook
- Instagram Feed Component
- i18n Request/Routing Config
- Next.js Config
- google-auth-library
- ESLint Config
- lucide-react
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
- page.tsx
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getRedis()` - 49 edges
2. `getCurrentSession()` - 33 edges
3. `formatPrice()` - 30 edges
4. `useCurrency()` - 21 edges
5. `getPrice()` - 20 edges
6. `p()` - 17 edges
7. `getProductsWithPriceOverrides()` - 17 edges
8. `compilerOptions` - 16 edges
9. `getAllPosts()` - 14 edges
10. `esc()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AdminSearch()` --indirect_call--> `p()`  [INFERRED]
  app/admin/AdminSearch.tsx → lib/email.ts
- `ProductsAdminList()` --indirect_call--> `p()`  [INFERRED]
  app/admin/ProductsAdminList.tsx → lib/email.ts
- `isTypickaUlice()` --indirect_call--> `p()`  [INFERRED]
  app/api/adresa/route.ts → lib/email.ts
- `POST()` --indirect_call--> `p()`  [INFERRED]
  app/api/checkout/route.ts → lib/email.ts
- `POST()` --indirect_call--> `p()`  [INFERRED]
  app/api/orders/route.ts → lib/email.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Product stock lookup pipeline (customer request to StockBadge render)** — readme_stock_app_produkt_slug_page_tsx, readme_stock_getproductstock, readme_stock_google_sheets_api, readme_stock_components_produktclient_tsx, readme_stock_lookupstock, readme_stock_stockbadge [EXTRACTED 1.00]
- **Alternative Google Sheets authentication strategies** — readme_stock_google_sheets_api, readme_stock_service_account, readme_stock_google_auth_library [INFERRED 0.85]
- **Environment variables required for stock integration** — readme_stock_env_local, readme_stock_google_sheet_id, readme_stock_google_sheets_api_key [EXTRACTED 1.00]

## Communities (75 total, 33 thin omitted)

### Community 0 - "Orders & Checkout Pipeline"
Cohesion: 0.06
Nodes (49): MessagesAdminListProps, DELETE(), GET(), POST(), requirePermission(), POST(), requireAccess(), DELETE() (+41 more)

### Community 1 - "Admin Accounts & Permissions"
Cohesion: 0.05
Nodes (66): AccountsAdminPanelProps, PERMISSION_LABELS, AdminDashboard(), AdminDashboardProps, getInitials(), CampaignSummary, Context, AdminPage() (+58 more)

### Community 2 - "Blog / Magazine CMS"
Cohesion: 0.10
Nodes (33): AdminSearch(), AdminSearchProps, CURRENCY_SYMBOLS, formatMoney(), ContentPreview(), czechDateToInputValue(), EMPTY_FORM, FormState (+25 more)

### Community 3 - "Products, Categories & Stock"
Cohesion: 0.26
Nodes (13): buildFuse(), CATEGORY_LABELS, ConfidentCard(), expandQuery(), getCategoryLabel(), highlightMatch(), isConfidentResult(), normalize() (+5 more)

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
Cohesion: 0.21
Nodes (16): CookiesPage(), StorageEntry, storageList, CookieBanner(), acceptAll(), clearConsent(), ConsentPreferences, getConsentPreferences() (+8 more)

### Community 8 - "Admin Analytics Dashboard"
Cohesion: 0.10
Nodes (29): Tab, BarChart(), CURRENCY_LABELS, formatDateShort(), formatMoney(), RankedTable(), SectionCard(), StatCard() (+21 more)

### Community 9 - "Reviews System"
Cohesion: 0.23
Nodes (10): KategoriePage(), getCategoryBySlug(), fetchFromRedis(), getStock(), getStockMap(), makeKey(), setStock(), setStockBulk() (+2 more)

### Community 10 - "Cart Page (Kosik)"
Cohesion: 0.19
Nodes (12): POST(), PriceEntry, GET(), Home(), HomeSlider(), getEffectivePrice(), getPriceOverrides(), getProductsWithPriceOverrides() (+4 more)

### Community 11 - "Admin Authentication"
Cohesion: 0.08
Nodes (42): ACTIVE_STATUSES, CURRENCY_SYMBOLS, formatDate(), formatMoney(), OrdersAdminList(), OrdersAdminListProps, PAYMENT_METHOD_LABELS, SHIPPING_PROVIDER_LABELS (+34 more)

### Community 12 - "Homepage"
Cohesion: 0.38
Nodes (5): calcAvg(), formatDate(), Review, ReviewCard(), Reviews()

### Community 13 - "Category Listing & Featured Products"
Cohesion: 0.20
Nodes (14): DiscountWidget(), CartContext, CartCtx, CartItem, CartProvider(), fetchDiscount(), itemKey(), PriceRaw (+6 more)

### Community 14 - "Dev Tooling Dependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, browserslist, _comment_browserslist, devDependencies, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 15 - "Product Detail Client"
Cohesion: 0.17
Nodes (25): POST(), capturePageview(), clearPostHogStorage(), isAdminRoute(), isAdminSession(), PostHogProvider(), startPostHog(), stopPostHog() (+17 more)

### Community 16 - "Contact Messages"
Cohesion: 0.16
Nodes (6): COLOR_MAP, isLayeredColor(), MediaItem, ProduktClient(), StockData, useStockPolling()

### Community 17 - "Address Lookup API (RUIAN)"
Cohesion: 0.29
Nodes (14): AdresaResult, callRuian(), capitalize(), formatPsc(), GET(), isJunkLokalita(), isMultiPsc(), isSilnaUlice() (+6 more)

### Community 18 - "Static Info Pages & Footer"
Cohesion: 0.15
Nodes (4): categories, footerNav, socialLinks, trustItems

### Community 19 - "Core NPM Dependencies"
Cohesion: 0.10
Nodes (43): BankovniPrevod(), Snapshot, SnapshotInfo, SnapshotItem, SuccessContent(), formatPrice(), addressBlock(), bankTransferBlock() (+35 more)

### Community 20 - "discountsStore.ts"
Cohesion: 0.29
Nodes (11): GET(), POST(), requirePermission(), CampaignContext, campaignFrom(), CampaignSummary, getCampaignContext(), resolveSegmentId() (+3 more)

### Community 21 - "Order Form (Objednavka)"
Cohesion: 0.12
Nodes (17): BESTSELLER_SLUGS, COLOR_LABELS, getProductImgs(), KosikPage(), ProductCard(), translateValue(), dopravyOptions, MOCK_ZBOXES (+9 more)

### Community 22 - "Product Search Bar"
Cohesion: 0.24
Nodes (11): Header(), languages, navRight, readLangFromCookie(), switchGoogleTranslate(), InfoGrid(), Logo(), clearGoogtransCookie() (+3 more)

### Community 23 - "dependencies"
Cohesion: 0.06
Nodes (31): fuse.js, google-auth-library, lucide-react, next, next-intl, dependencies, fuse.js, google-auth-library (+23 more)

### Community 24 - "reviews.ts"
Cohesion: 0.32
Nodes (5): GET(), ProduktPage(), products, getProductStock(), StockKey

### Community 25 - "priceOverrides.ts"
Cohesion: 0.25
Nodes (11): CURRENCIES, Currency, CurrencyCode, CurrencyContext, CurrencyContextType, approxConvert(), currencyOf(), FONT_PATH (+3 more)

### Community 26 - "index.ts"
Cohesion: 0.33
Nodes (8): GoogleTranslate(), isGoogleTranslateLoaded(), loadGoogleTranslate(), readGoogtransLang(), LangContext, LangProvider(), Locale, readLocale()

### Community 27 - "KategorieClient.tsx"
Cohesion: 0.23
Nodes (8): anyInStock(), Category, KategorieClient(), maxStock(), sortOptions, StockPill(), StoredReview, Product

### Community 28 - "orders.ts"
Cohesion: 0.14
Nodes (11): slides, slidesData, getProductBySlug(), MediaItem, ModelColor, ModelColorLayered, ProductColor, ProductCombination (+3 more)

### Community 29 - "package.json"
Cohesion: 0.48
Nodes (6): formatPrice(), normalizePrice(), priceEquals(), ProductsAdminList(), ProductsAdminListProps, getProductCombinations()

### Community 30 - "route.ts"
Cohesion: 0.22
Nodes (5): geistMono, geistSans, metadata, viewport, CurrencyProvider()

### Community 31 - "Product Export Script"
Cohesion: 0.29
Nodes (6): content, require, rows, wb, ws, xlsx

### Community 32 - "Product Update Script"
Cohesion: 0.29
Nodes (6): notFound, productsContent, require, rows, workbook, xlsx

### Community 33 - "Reviews.tsx"
Cohesion: 0.22
Nodes (4): defaultForm, FormState, returnMethods, steps

### Community 34 - "Terms & Conditions Page"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 42 - "google-auth-library"
Cohesion: 0.40
Nodes (4): SITE_URL, sitemap(), STATIC_PAGES, categories

### Community 77 - "page.tsx"
Cohesion: 0.38
Nodes (6): calcStats(), formatDate(), RecenzePage(), Review, ReviewCard(), Window

## Knowledge Gaps
- **251 isolated node(s):** `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps`, `AdminSearchProps`, `CURRENCY_SYMBOLS` (+246 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Core NPM Dependencies`, `Dev Tooling Dependencies`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Core NPM Dependencies` to `dependencies`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **What connects `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps` to the rest of the system?**
  _251 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Orders & Checkout Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06142410015649452 - nodes in this community are weakly interconnected._
- **Should `Admin Accounts & Permissions` be split into smaller, more focused modules?**
  _Cohesion score 0.051201671891327065 - nodes in this community are weakly interconnected._
- **Should `Blog / Magazine CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.10299003322259136 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config & Refs` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._