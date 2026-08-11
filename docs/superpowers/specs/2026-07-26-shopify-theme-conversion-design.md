# Design: Replicate the Storefront as a Shopify Liquid Theme

## Problem

Stomatal Farms currently runs as a fully custom Vite/React SPA (React Router,
embla carousels, Tailwind + shadcn/radix, a custom Storefront-API-driven cart,
an InsForge-backed live Google reviews carousel, a WhatsApp ordering flow),
already talking to Shopify only for product data and checkout
(`pay.stomatalfarms.com`). The goal is a real, installable Shopify theme —
the kind a merchant picks from Online Store → Themes and edits in the Theme
Customizer — that replicates the current site's UI and behavior exactly, no
visual or functional changes.

## Decisions

- **Target**: a standard Shopify OS 2.0 Liquid theme (`layout/`, `sections/`,
  `snippets/`, `templates/*.json`, `assets/`, `config/`) — not Hydrogen. This
  is what "Shopify template" means to the user: theme-picker-installable,
  Theme Customizer-editable.
- **Cart & checkout**: switch to Shopify's native theme cart (Ajax Cart API)
  instead of the current custom Storefront-API cart flow. Same end-to-end
  behavior for a shopper (add to cart, view cart, checkout), different —
  and more idiomatic for a theme — underlying mechanism.
- **External integrations carry over exactly**: the InsForge-backed live
  Google reviews carousel (built earlier this project) and the WhatsApp
  ordering flow both port over as-is, calling the same backends from the
  theme's client-side JS.
- **Styling**: the existing Tailwind config compiles to a single
  `assets/tailwind.css` theme asset. Ported Liquid markup keeps the exact
  same utility class names as the current JSX. This trades theme-idiomatic
  CSS (BEM + design tokens, per the `liquid-theme-standards` skill) for
  provable pixel fidelity — same classes in, same computed styles out. This
  was chosen explicitly because "exact, no UI changes" is a hard requirement
  and Tailwind's arbitrary-value classes (`text-[#4f7a2e]`, `bg-[#f9f6f0]`,
  etc.) are pervasive throughout the current design.
- **Interactivity**: React components port to vanilla-JS Web Components
  (custom elements) — the pattern Shopify's own reference themes use, and
  achievable without behavior drift because Embla Carousel's core library
  (used for every carousel on the site) is vanilla JS underneath the React
  wrapper the current site uses.
- **Product/review data**: product data comes from Shopify's native
  `product`/`collection` Liquid objects (server-rendered), not client-side
  Storefront API calls — standard practice for a theme, and simpler than
  what the current SPA does. Reviews keep doing a client-side fetch to
  InsForge, unchanged.
- **Tooling**: Shopify CLI (already installed, v4.6.1, already authenticated
  to `nvhu9m-0r.myshopify.com`). `shopify theme dev` runs against a fresh,
  unpublished development theme it creates itself — it never touches any of
  the store's existing themes (Spotlight, Horizon, `stomatal2026`, etc.).
  Scaffolded from Shopify's official `skeleton-theme` starter into
  `shopify-theme/` in this repo.

## Scope: three phases

The homepage (`src/pages/Index.tsx`) interleaves product-grid and reviews
sections throughout the page — they aren't cleanly separable from "the rest
of the homepage." Phases are split by what's structurally distinct instead:

**Phase 1 — Full homepage + theme foundation.** Theme file structure, the
Tailwind asset pipeline, global layout (`layout/theme.liquid`), header/nav
(incl. the Aurora dropdown, scroll-shrink behavior, cart icon), footer, and
every homepage section in `Index.tsx`'s order: Hero, SocialProofBar,
GoogleReviewsCarousel (live InsForge data), AuroraComparison, BundleCarousel,
ProductsSection (real Shopify collection data), GreensSection, VideoCarousel,
WhyUs, FAQ, InstagramCarousel, FinalCTA. Product-grid sections read real
Shopify product/collection objects (no separate "wire up products later"
step needed — Liquid makes this direct). Cart icon/drawer exist visually in
the header but are out of scope to make functional here (Phase 2).

**Phase 2 — Collection + Product Detail templates, native cart.** The
`templates/collection.json` and `templates/product.json` pages (currently
`src/pages/Collections.tsx` and `src/pages/ProductDetail.tsx`), variant
selection, and the full native Ajax Cart flow (add to cart, cart drawer,
quantity updates, checkout handoff) replacing the header's currently-inert
cart icon from Phase 1.

**Phase 3 — Remaining pages, WhatsApp flow, final QA.** Contact and legal
pages (`Contact.tsx`, `PrivacyPolicy.tsx`, `TermsConditions.tsx`,
`ReturnsRefunds.tsx`), the WhatsApp ordering flow, and a final pixel-diff
verification pass across the whole site against the live current site.

Each phase gets pushed to the same development theme and is independently
reviewable before moving to the next. This design doc covers **Phase 1**
only; Phases 2 and 3 get their own spec once Phase 1 ships.

## Phase 1 architecture

```
shopify-theme/
  layout/theme.liquid          — <head>, header include, {{ content_for_layout }}, footer include
  templates/index.json         — homepage section list, in Index.tsx's order
  sections/
    header.liquid              — top trust bar + nav + logo + cart icon (inert in Phase 1)
    hero.liquid
    social-proof-bar.liquid
    google-reviews-carousel.liquid  — fetches InsForge client-side, same as now
    aurora-comparison.liquid
    bundle-carousel.liquid
    products-section.liquid    — real Shopify collection object
    greens-section.liquid      — real Shopify collection object
    video-carousel.liquid
    why-us.liquid
    faq.liquid
    instagram-carousel.liquid
    final-cta.liquid
    footer.liquid
  snippets/                    — shared partials (icons, buttons, price formatting)
  assets/
    tailwind.css                — compiled from the existing tailwind.config
    theme.js                    — Web Component registrations (carousel, nav dropdown, etc.)
  config/settings_schema.json   — minimal; per-section {% schema %} blocks hold editable content
```

Each section's `{% schema %}` block exposes the current hardcoded copy/images
as default setting values — a merchant can edit them later via the
Customizer, but nothing looks different until someone does.

## Data flow

- **Static content** (Hero, SocialProofBar, AuroraComparison, WhyUs, FAQ,
  FinalCTA, InstagramCarousel): section settings with defaults matching the
  current hardcoded copy exactly.
- **Products** (BundleCarousel, ProductsSection, GreensSection): each
  section's schema takes a `collection` setting; the section loops
  `collection.products` via Liquid, server-rendered at request time.
- **Reviews** (GoogleReviewsCarousel): unchanged client-side flow —
  `assets/theme.js`'s reviews module fetches from InsForge
  (`VITE_INSFORGE_URL`/anon key equivalents become theme-level JS constants
  or `{{ settings.* }}`-injected values) on page load, same query/shape as
  the current `googlePlaces.ts`, rendering the same white review cards.
- **Video/Instagram carousels**: static asset lists (images/video URLs)
  as section blocks, looped by Embla-core-backed custom elements.

## Interactivity

Each interactive piece becomes one custom element registered in
`assets/theme.js`:

- `<nav-dropdown>` — Aurora category dropdown (hover/focus reveal), mirrors
  `Header.tsx`'s current group-hover behavior.
- `<sticky-header>` — scroll-shrink behavior (`isScrolled` state → class
  toggle), mirrors `Header.tsx`'s scroll listener.
- `<embla-carousel>` — wraps Embla's core (non-React) library; used by
  GoogleReviewsCarousel, BundleCarousel, VideoCarousel, InstagramCarousel,
  each just passing different slide content into the same base element.
- `<review-carousel>` extends `<embla-carousel>` — adds the InsForge fetch,
  filter/sort dropdowns, and card rendering on top of the shared carousel
  behavior.

## Error handling

- Reviews fetch failure: same behavior as today — the section renders
  nothing rather than a broken/empty box (ported directly from
  `GoogleReviewsCarousel.tsx`'s existing `isError && reviews.length === 0`
  check).
- Missing/unset section settings (e.g. no collection assigned to
  ProductsSection yet): section renders its static chrome with an empty
  product loop rather than erroring, so an incompletely-configured theme
  never 500s.

## Testing

- `shopify theme dev` against the development theme created earlier this
  session (ID `156807921821`) for live local preview during the build.
- Playwright screenshot comparisons, section by section, between the dev
  theme preview and the live current site (`stomatalfarms.com` — the actual
  production site, not the local Vite dev server) — same technique already
  used earlier in this project for verifying UI changes.
- `shopify theme check` for Liquid lint/validation before considering the
  phase done.

## Out of scope for this spec

- Collection/Product Detail page templates, native cart functionality
  (Phase 2).
- WhatsApp flow, Contact/legal pages, final cross-site pixel QA (Phase 3).
- Publishing the theme live (stays an unpublished development/preview theme
  until the user explicitly decides to publish).
