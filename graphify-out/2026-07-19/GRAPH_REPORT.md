# Graph Report - Slingr  (2026-07-19)

## Corpus Check
- 171 files · ~229,763 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1041 nodes · 2516 edges · 76 communities (45 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da43c653`
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
- react
- resend
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

## God Nodes (most connected - your core abstractions)
1. `useT()` - 88 edges
2. `getRedis()` - 63 edges
3. `getCurrentSession()` - 37 edges
4. `formatPrice()` - 33 edges
5. `useLang()` - 30 edges
6. `useCurrency()` - 23 edges
7. `p()` - 23 edges
8. `getPrice()` - 21 edges
9. `esc()` - 19 edges
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

## Communities (76 total, 31 thin omitted)

### Community 0 - "Orders & Checkout Pipeline"
Cohesion: 0.33
Nodes (9): buildFuse(), expandQuery(), getCategoryLabel(), highlightMatch(), normalize(), SEARCH_SYNONYMS, SearchOverlay(), searchProducts() (+1 more)

### Community 1 - "Admin Accounts & Permissions"
Cohesion: 0.07
Nodes (49): AccountsAdminPanelProps, PERMISSION_LABELS, AdminPage(), DELETE(), GET(), PATCH(), POST(), requireMainAccount() (+41 more)

### Community 2 - "Blog / Magazine CMS"
Cohesion: 0.13
Nodes (27): ContentPreview(), czechDateToInputValue(), EMPTY_FORM, FormState, inputValueToCzechDate(), MagazinAdminList(), checkAccess(), GET() (+19 more)

### Community 3 - "Products, Categories & Stock"
Cohesion: 0.10
Nodes (32): ClaimCard(), ClaimsAdminListProps, RESOLUTION_LABELS, STATUS_LABELS, STATUS_ORDER, statusClasses(), TYPE_LABELS, DELETE() (+24 more)

### Community 4 - "TypeScript Config & Refs"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 5 - "Docs: READMEs & Stock Setup Guide"
Cohesion: 0.13
Nodes (21): MessagesAdminListProps, POST(), requireAccess(), DELETE(), GET(), PATCH(), requireAccess(), fail() (+13 more)

### Community 6 - "Address Autocomplete Form"
Cohesion: 0.11
Nodes (17): SITE_URL, sitemap(), STATIC_PAGES, CategoryProductRows(), Footer(), socialLinks, HomeLink(), categories (+9 more)

### Community 7 - "Root Layout & Consent Tracking"
Cohesion: 0.14
Nodes (15): AddedModal(), COLOR_MAP, Gallery(), isLayeredColor(), MediaItem, NotifyModal(), ProduktClient(), StockBadge() (+7 more)

### Community 8 - "Admin Analytics Dashboard"
Cohesion: 0.06
Nodes (45): AdminDashboard(), AdminDashboardProps, getInitials(), Tab, AdminSearch(), AdminSearchProps, CURRENCY_SYMBOLS, formatMoney() (+37 more)

### Community 9 - "Reviews System"
Cohesion: 0.09
Nodes (27): geistMono, geistSans, metadata, viewport, calcStats(), formatDate(), RecenzePage(), Review (+19 more)

### Community 10 - "Cart Page (Kosik)"
Cohesion: 0.13
Nodes (29): BESTSELLER_SLUGS, getProductImgs(), KosikPage(), ProductCard(), DiscountWidget(), Header(), ProductPrice(), ProductCard() (+21 more)

### Community 11 - "Admin Authentication"
Cohesion: 0.07
Nodes (47): ACTIVE_STATUSES, CURRENCY_SYMBOLS, formatDate(), formatMoney(), OrdersAdminList(), OrdersAdminListProps, PAYMENT_METHOD_LABELS, SHIPPING_PROVIDER_LABELS (+39 more)

### Community 12 - "Homepage"
Cohesion: 0.21
Nodes (16): DELETE(), GET(), POST(), requirePermission(), APPROX_RATES, calcDiscount(), Discount, DiscountCartItem (+8 more)

### Community 13 - "Category Listing & Featured Products"
Cohesion: 0.25
Nodes (14): CheckoutItem, POST(), GET(), OrderReqItem, POST(), getClientIp(), findDiscount(), resolveDiscountForOrder() (+6 more)

### Community 14 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/pdfkit, @types/qrcode (+13 more)

### Community 15 - "Product Detail Client"
Cohesion: 0.16
Nodes (26): POST(), capturePageview(), clearPostHogStorage(), isAdminRoute(), isAdminSession(), PostHogProvider(), startPostHog(), stopPostHog() (+18 more)

### Community 16 - "AdminDashboard.tsx"
Cohesion: 0.26
Nodes (14): fail(), POST(), StockNotifyErrorCode, sendBackInStockEmail(), getProductBySlug(), getRedis(), addWatcher(), fieldKey() (+6 more)

### Community 17 - "Address Lookup API (RUIAN)"
Cohesion: 0.29
Nodes (14): AdresaResult, callRuian(), capitalize(), formatPsc(), GET(), isJunkLokalita(), isMultiPsc(), isSilnaUlice() (+6 more)

### Community 18 - "Static Info Pages & Footer"
Cohesion: 0.15
Nodes (18): POST(), StockEntryInput, GET(), KategoriePage(), ProduktPage(), getCategoryBySlug(), fetchFromRedis(), getProductStock() (+10 more)

### Community 19 - "Core NPM Dependencies"
Cohesion: 0.14
Nodes (45): BankovniPrevod(), qrcode, formatPrice(), approxConvert(), addressBlock(), bankTransferBlock(), campaignBodyToHtml(), CLAIM_RESOLUTION_LABELS (+37 more)

### Community 20 - "reviews.ts"
Cohesion: 0.18
Nodes (16): ReviewsAdminList(), ReviewsAdminListProps, fail(), GET(), POST(), ReviewErrorCode, sendReviewThankYouEmail(), parseUserAgent() (+8 more)

### Community 21 - "priceOverrides.ts"
Cohesion: 0.19
Nodes (16): POST(), PriceEntry, GET(), getEffectivePrice(), getPriceOverrides(), getProductsWithPriceOverrides(), getUnitAmountFor(), overrideKey() (+8 more)

### Community 22 - "Product Search Bar"
Cohesion: 0.06
Nodes (35): ONasPage(), ApiOrderItem, CopyButton(), DeliveryAddressBlock(), Dobirka(), KartaStripe(), Snapshot, SnapshotInfo (+27 more)

### Community 23 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, fuse.js, google-auth-library, lucide-react, next, pdfkit, posthog-js, react-dom (+15 more)

### Community 24 - "reviews.ts"
Cohesion: 0.15
Nodes (7): dead, DYNAMIC_NAMESPACES, errors, keys, messages, ROOT, used

### Community 25 - "priceOverrides.ts"
Cohesion: 0.29
Nodes (11): GET(), POST(), requirePermission(), CampaignContext, campaignFrom(), CampaignSummary, getCampaignContext(), resolveSegmentId() (+3 more)

### Community 27 - "package.json"
Cohesion: 0.18
Nodes (10): _comment_browserslist, name, private, scripts, build, check:messages, dev, lint (+2 more)

### Community 28 - "page.tsx"
Cohesion: 0.12
Nodes (27): CookiesPage(), CookieBanner(), BROWSER_HELP, COOKIES_CATEGORIES, COOKIES_CONSENT_INTRO, COOKIES_INTRO, COOKIES_SUBTITLE, COOKIES_TITLE (+19 more)

### Community 29 - "Skladovost přes Google Sheets — návod k nastavení"
Cohesion: 0.17
Nodes (11): 1. Vytvoř Google Sheet, 2. Google Sheets API klíč (pro veřejný sheet), 3. (Alternativa) Service Account pro soukromý sheet, 4. Environment variables, 5. Soubory do projektu, 6. Jak to funguje, 7. Jak editovat skladovost, 8. Přidání nového produktu / kombinace (+3 more)

### Community 30 - "package.json"
Cohesion: 0.05
Nodes (41): metadata, CategorySection(), AddressBlock, AddressErrors, AdresaResult, cacheAdresa, cacheMesto, defaultForm() (+33 more)

### Community 31 - "Product Export Script"
Cohesion: 0.29
Nodes (6): content, require, rows, wb, ws, xlsx

### Community 32 - "Product Update Script"
Cohesion: 0.29
Nodes (6): notFound, productsContent, require, rows, workbook, xlsx

### Community 33 - "Reviews.tsx"
Cohesion: 0.24
Nodes (6): Home(), buildReturnMethods(), buildSteps(), defaultForm, FormState, ReklamaceAVraceniPage()

### Community 34 - "Terms & Conditions Page"
Cohesion: 0.46
Nodes (6): fail(), NewsletterErrorCode, POST(), isValidNewsletterEmail(), SubscribeResult, subscribeToNewsletter()

### Community 35 - "browserslist"
Cohesion: 0.38
Nodes (5): anyInStock(), KategorieClient(), maxStock(), TILE_STYLE, Category

### Community 37 - "Instagram Feed Component"
Cohesion: 0.25
Nodes (8): browserslist, chrome >= 108, edge >= 108, firefox >= 108, ios_saf >= 15.4, not dead, not op_mini all, safari >= 15.4

### Community 42 - "ReviewsAdminList.tsx"
Cohesion: 0.50
Nodes (3): buildCategories(), FaqCategory, FaqPage()

### Community 44 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 80 - "page.tsx"
Cohesion: 0.09
Nodes (27): KontaktPage(), metadata, metadata, igPosts, LegalLayout(), Section(), PrivacyPage(), TermsPage() (+19 more)

## Knowledge Gaps
- **268 isolated node(s):** `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps`, `AdminSearchProps`, `CURRENCY_SYMBOLS` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `getProductBySlug`, `posthog-node`, `react`, `resend`, `Core NPM Dependencies`, `package.json`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Core NPM Dependencies` to `dependencies`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `useT()` connect `Product Search Bar` to `Orders & Checkout Pipeline`, `Reviews.tsx`, `browserslist`, `Address Autocomplete Form`, `Root Layout & Consent Tracking`, `Reviews System`, `ReviewsAdminList.tsx`, `Cart Page (Kosik)`, `page.tsx`, `Core NPM Dependencies`, `page.tsx`, `package.json`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `PERMISSION_LABELS`, `AccountsAdminPanelProps`, `AdminDashboardProps` to the rest of the system?**
  _268 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Accounts & Permissions` be split into smaller, more focused modules?**
  _Cohesion score 0.07242063492063493 - nodes in this community are weakly interconnected._
- **Should `Blog / Magazine CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.13012477718360071 - nodes in this community are weakly interconnected._
- **Should `Products, Categories & Stock` be split into smaller, more focused modules?**
  _Cohesion score 0.1006006006006006 - nodes in this community are weakly interconnected._