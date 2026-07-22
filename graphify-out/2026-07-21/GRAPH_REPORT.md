# Graph Report - Slingr  (2026-07-20)

## Corpus Check
- 172 files · ~225,044 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1055 nodes · 2601 edges · 73 communities (41 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `febf45d8`
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
- AdminDashboard.tsx
- Address Lookup API (RUIAN)
- Static Info Pages & Footer
- Core NPM Dependencies
- reviews.ts
- priceOverrides.ts
- Product Search Bar
- dependencies
- reviews.ts
- priceOverrides.ts
- index.ts
- package.json
- page.tsx
- Skladovost přes Google Sheets — návod k nastavení
- package.json
- Product Export Script
- Product Update Script
- Reviews.tsx
- Terms & Conditions Page
- browserslist
- Instagram Feed Component
- i18n Request/Routing Config
- Next.js Config
- ReviewsAdminList.tsx
- ESLint Config
- README.md
- next-intl Dependency
- graphify
- getProductBySlug
- posthog-node
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
1. `useT()` - 88 edges
2. `getRedis()` - 62 edges
3. `getCurrentSession()` - 37 edges
4. `formatPrice()` - 33 edges
5. `useLang()` - 30 edges
6. `p()` - 24 edges
7. `useCurrency()` - 23 edges
8. `getPrice()` - 21 edges
9. `esc()` - 20 edges
10. `ProduktClient()` - 17 edges

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

## Communities (73 total, 32 thin omitted)

### Community 0 - "Orders & Checkout Pipeline"
Cohesion: 0.10
Nodes (20): BESTSELLER_SLUGS, getProductImgs(), KosikPage(), AddedModal(), COLOR_MAP, Gallery(), isLayeredColor(), MediaItem (+12 more)

### Community 1 - "Admin Accounts & Permissions"
Cohesion: 0.20
Nodes (21): AdminPage(), DELETE(), GET(), PATCH(), POST(), requireMainAccount(), Account, addAccount() (+13 more)

### Community 2 - "Blog / Magazine CMS"
Cohesion: 0.08
Nodes (35): AdminSearch(), AdminSearchProps, CURRENCY_SYMBOLS, formatMoney(), ContentPreview(), czechDateToInputValue(), EMPTY_FORM, FormState (+27 more)

### Community 3 - "Products, Categories & Stock"
Cohesion: 0.06
Nodes (54): ClaimCard(), ClaimsAdminListProps, RESOLUTION_LABELS, STATUS_LABELS, STATUS_ORDER, statusClasses(), TYPE_LABELS, MessagesAdminListProps (+46 more)

### Community 4 - "TypeScript Config & Refs"
Cohesion: 0.06
Nodes (30): ./*, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 5 - "Docs: READMEs & Stock Setup Guide"
Cohesion: 0.20
Nodes (14): normalizeName(), POST(), ADMIN_COOKIE_NAME, ADMIN_HINT_COOKIE_NAME, bufToHex(), checkPassword(), createSessionToken(), getKey() (+6 more)

### Community 6 - "Address Autocomplete Form"
Cohesion: 0.13
Nodes (21): geistMono, geistSans, metadata, viewport, DiscountWidget(), CartContext, CartCtx, CartItem (+13 more)

### Community 7 - "Root Layout & Consent Tracking"
Cohesion: 0.14
Nodes (28): ProductCard(), CategoryProductRows(), Header(), anyInStock(), KategorieClient(), maxStock(), TILE_STYLE, ProductPrice() (+20 more)

### Community 8 - "Admin Analytics Dashboard"
Cohesion: 0.13
Nodes (22): BarChart(), CURRENCY_LABELS, formatDateShort(), formatMoney(), RankedTable(), SectionCard(), StatCard(), AnalyticsPanel() (+14 more)

### Community 9 - "Reviews System"
Cohesion: 0.10
Nodes (26): KontaktPage(), metadata, metadata, LegalLayout(), Section(), PrivacyPage(), TermsPage(), PRIVACY_BODY (+18 more)

### Community 10 - "Cart Page (Kosik)"
Cohesion: 0.13
Nodes (22): calcStats(), formatDate(), RecenzePage(), Review, ReviewCard(), Window, calcAvg(), formatDate() (+14 more)

### Community 11 - "Admin Authentication"
Cohesion: 0.07
Nodes (47): ACTIVE_STATUSES, CURRENCY_SYMBOLS, formatDate(), formatMoney(), OrdersAdminList(), OrdersAdminListProps, PAYMENT_METHOD_LABELS, SHIPPING_PROVIDER_LABELS (+39 more)

### Community 12 - "Homepage"
Cohesion: 0.23
Nodes (10): AccountsAdminPanelProps, PERMISSION_LABELS, AdminDashboard(), AdminDashboardProps, getInitials(), Tab, PublicAccount, GRANTABLE_PERMISSIONS (+2 more)

### Community 13 - "Category Listing & Featured Products"
Cohesion: 0.06
Nodes (60): DiscountsAdminPanel(), DiscountsAdminPanelProps, isExpired(), DELETE(), GET(), POST(), requirePermission(), POST() (+52 more)

### Community 14 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+13 more)

### Community 15 - "Product Detail Client"
Cohesion: 0.16
Nodes (26): POST(), capturePageview(), clearPostHogStorage(), isAdminRoute(), isAdminSession(), PostHogProvider(), startPostHog(), stopPostHog() (+18 more)

### Community 16 - "AdminDashboard.tsx"
Cohesion: 0.13
Nodes (20): buildDopravyOptions(), buildPlatbyOptions(), MOCK_ZBOXES, ObjednavkaPage(), PacketaPoint, Window, buildBenefits(), buildPaymentMethods() (+12 more)

### Community 17 - "Address Lookup API (RUIAN)"
Cohesion: 0.29
Nodes (14): AdresaResult, callRuian(), capitalize(), formatPsc(), GET(), isJunkLokalita(), isMultiPsc(), isSilnaUlice() (+6 more)

### Community 18 - "Static Info Pages & Footer"
Cohesion: 0.07
Nodes (50): normalizePrice(), percentFromSale(), priceEquals(), ProductsAdminList(), ProductsAdminListProps, saleFromPercent(), fail(), POST() (+42 more)

### Community 19 - "Core NPM Dependencies"
Cohesion: 0.14
Nodes (44): BankovniPrevod(), addressBlock(), bankTransferBlock(), campaignBodyToHtml(), CLAIM_RESOLUTION_LABELS, CLAIM_TYPE_LABELS, claimDetailsTable(), claimLabel() (+36 more)

### Community 20 - "reviews.ts"
Cohesion: 0.27
Nodes (12): fail(), GET(), POST(), ReviewErrorCode, sendReviewThankYouEmail(), addReview(), checkAndSetCooldown(), getAllReviews() (+4 more)

### Community 21 - "priceOverrides.ts"
Cohesion: 0.18
Nodes (10): _comment_browserslist, name, private, scripts, build, check:messages, dev, lint (+2 more)

### Community 22 - "Product Search Bar"
Cohesion: 0.08
Nodes (30): ONasPage(), ApiOrderItem, CopyButton(), DeliveryAddressBlock(), Dobirka(), KartaStripe(), Snapshot, SnapshotInfo (+22 more)

### Community 23 - "dependencies"
Cohesion: 0.09
Nodes (23): fuse.js, google-auth-library, next-intl, dependencies, fuse.js, google-auth-library, next-intl, pdfkit (+15 more)

### Community 24 - "reviews.ts"
Cohesion: 0.15
Nodes (7): dead, DYNAMIC_NAMESPACES, errors, keys, messages, ROOT, used

### Community 25 - "priceOverrides.ts"
Cohesion: 0.29
Nodes (11): GET(), POST(), requirePermission(), CampaignContext, campaignFrom(), CampaignSummary, getCampaignContext(), resolveSegmentId() (+3 more)

### Community 26 - "index.ts"
Cohesion: 0.25
Nodes (8): browserslist, chrome >= 108, edge >= 108, firefox >= 108, ios_saf >= 15.4, not dead, not op_mini all, safari >= 15.4

### Community 27 - "package.json"
Cohesion: 0.20
Nodes (11): GET(), DiscountEntry, POST(), DELETE(), POST(), StockEntryInput, findAccountById(), listOrders() (+3 more)

### Community 28 - "page.tsx"
Cohesion: 0.12
Nodes (26): CookiesPage(), CookieBanner(), subscribeConsent(), BROWSER_HELP, COOKIES_CATEGORIES, COOKIES_CONSENT_INTRO, COOKIES_INTRO, COOKIES_SUBTITLE (+18 more)

### Community 30 - "package.json"
Cohesion: 0.11
Nodes (18): AddressBlock, AddressErrors, AdresaResult, cacheAdresa, cacheMesto, defaultForm(), emptyAddress(), formatPhone() (+10 more)

### Community 31 - "Product Export Script"
Cohesion: 0.29
Nodes (6): content, require, rows, wb, ws, xlsx

### Community 32 - "Product Update Script"
Cohesion: 0.29
Nodes (6): notFound, productsContent, require, rows, workbook, xlsx

### Community 33 - "Reviews.tsx"
Cohesion: 0.14
Nodes (13): Home(), buildReturnMethods(), buildSteps(), defaultForm, FormState, ReklamaceAVraceniPage(), Newsletter(), WelcomeDiscountPopup() (+5 more)

### Community 35 - "browserslist"
Cohesion: 0.11
Nodes (16): Jazyky, Katalog a sklad, Kontrola před nasazením, SLINGR, Spuštění, 1. Kde jsou data, 2. Sety (bundly), 3. Environment variables (+8 more)

### Community 42 - "ReviewsAdminList.tsx"
Cohesion: 0.15
Nodes (10): metadata, buildCategories(), CategorySection(), FaqCategory, FaqPage(), Footer(), socialLinks, HomeLink() (+2 more)

### Community 48 - "posthog-node"
Cohesion: 0.47
Nodes (4): ReviewsAdminList(), ReviewsAdminListProps, parseUserAgent(), Review

## Knowledge Gaps
- **269 isolated node(s):** `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps`, `AdminSearchProps`, `CURRENCY_SYMBOLS` (+264 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Instagram Feed Component`, `README.md`, `graphify`, `getProductBySlug`, `Core NPM Dependencies`, `priceOverrides.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Core NPM Dependencies` to `dependencies`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `useT()` connect `Product Search Bar` to `Orders & Checkout Pipeline`, `Reviews.tsx`, `Blog / Magazine CMS`, `Address Autocomplete Form`, `Root Layout & Consent Tracking`, `Reviews System`, `ReviewsAdminList.tsx`, `Cart Page (Kosik)`, `AdminDashboard.tsx`, `Core NPM Dependencies`, `page.tsx`, `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps` to the rest of the system?**
  _269 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Orders & Checkout Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.10052910052910052 - nodes in this community are weakly interconnected._
- **Should `Blog / Magazine CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.08233117483811286 - nodes in this community are weakly interconnected._
- **Should `Products, Categories & Stock` be split into smaller, more focused modules?**
  _Cohesion score 0.05926251097453907 - nodes in this community are weakly interconnected._