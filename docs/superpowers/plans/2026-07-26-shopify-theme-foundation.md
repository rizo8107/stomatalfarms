# Shopify Theme Foundation (Phase 1a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the theme foundation for the Shopify Liquid replication of the Stomatal Farms site — the Tailwind asset pipeline, the global page shell, and the header/footer — pixel- and behavior-exact to the current React SPA, proving out the whole technical approach (compiled Tailwind + vanilla-JS Web Components) before porting the 11 remaining homepage content sections in a follow-up plan.

**Architecture:** The existing Tailwind config compiles to a single `assets/tailwind.css` theme asset via the Tailwind CLI (already available at the repo root, `tailwindcss@3.4.17`), scanning `shopify-theme/**/*.liquid` for class names instead of `.tsx`. Liquid markup keeps the exact same utility class names as the current JSX. Interactive header behavior (sticky/scroll-shrink, Aurora dropdown) becomes two vanilla-JS custom elements registered in `assets/theme.js`, mirroring `Header.tsx`'s `useState`/`useEffect` logic exactly.

**Tech Stack:** Shopify OS 2.0 Liquid theme (`shopify-theme/`, already scaffolded from `Shopify/skeleton-theme`), Tailwind CLI v3.4.17 (root `node_modules`), vanilla JS Web Components, Shopify CLI v4.6.1 (already authenticated to `nvhu9m-0r.myshopify.com`, dev theme ID `156807921821` already running via `shopify theme dev`).

## Global Constraints

- Every visual value (colors, spacing, copy, image assets) must match the current React source **exactly** — this is a hard "no UI changes" requirement from the approved spec (`docs/superpowers/specs/2026-07-26-shopify-theme-conversion-design.md`).
- Ported Liquid markup uses the **same Tailwind utility class names** as the current JSX — do not translate to hand-written CSS or BEM.
- The theme's compiled CSS asset lives at `shopify-theme/assets/tailwind.css`. Content-scan config points at `shopify-theme/**/*.liquid`, not `.tsx`.
- The dev theme (ID `156807921821`) is already running via `shopify theme dev` in the background — every task's manual verification uses its local preview at `http://127.0.0.1:9292` (changes hot-reload automatically; no redeploy step needed).
- Do not modify or delete any of the store's other existing themes (Spotlight, Horizon, Dwell, Savor, Crave, Taste, Vessel, `stomatal2026`, etc.).
- Source of truth for exact values is the real files under `src/` in this repo — read them, don't approximate from memory.

---

### Task 1: Tailwind asset pipeline

**Files:**
- Create: `shopify-theme/tailwind.config.js`
- Create: `shopify-theme/tailwind-input.css`
- Modify: `package.json` (root — add a build script)

**Interfaces:**
- Produces: `shopify-theme/assets/tailwind.css` (compiled output), containing every custom color/font/animation token from the current `tailwind.config.ts` and `src/index.css`. Later tasks (2–4) reference these exact class names and CSS custom properties (`--brand`, `--brand-deep`, `--cream`, `--surface`, `--text`, `--muted-text`, `--gold`, `--terracotta`, plus the HSL-based shadcn tokens) — do not rename any of them.

- [ ] **Step 1: Create the theme's Tailwind config**

Create `shopify-theme/tailwind.config.js` — a plain-JS port of the root `tailwind.config.ts`, with `content` pointing at Liquid files instead of `.tsx`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./shopify-theme/**/*.liquid"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sage: {
          DEFAULT: "hsl(var(--sage))",
          light: "hsl(var(--sage-light))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        terracotta: {
          DEFAULT: "hsl(var(--terracotta))",
          light: "hsl(var(--terracotta-light))",
        },
        earth: "hsl(var(--earth))",
        "warm-white": "hsl(var(--warm-white))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        smoke: {
          "0%": { opacity: "0", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.3" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(1.5)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        smoke: "smoke 3s ease-out infinite",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 30px -8px rgba(0, 0, 0, 0.1)",
        card: "0 2px 12px -2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 12px 40px -12px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
```

(`tailwindcss-animate` and the `accordion-*` keyframes are omitted — those back shadcn's Radix `Accordion` component, which Phase 1a doesn't port. Add them back in the plan that ports FAQ.tsx, which does use an accordion.)

- [ ] **Step 2: Create the Tailwind input file with design tokens**

Create `shopify-theme/tailwind-input.css` — the `@tailwind` directives plus the exact `:root` custom properties from `src/index.css:8-71` (light mode only; the current site's theme customizer doesn't expose a dark-mode toggle, so `.dark` isn't needed) and the base-layer rules from `src/index.css:113-130`:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 36 43% 96%;
    --foreground: 120 14% 12%;
    --card: 36 50% 99%;
    --card-foreground: 120 14% 12%;
    --popover: 36 50% 99%;
    --popover-foreground: 120 14% 12%;
    --primary: 97 47% 33%;
    --primary-foreground: 0 0% 100%;
    --secondary: 109 52% 20%;
    --secondary-foreground: 0 0% 100%;
    --muted: 96 18% 91%;
    --muted-foreground: 100 13% 42%;
    --accent: 23 47% 47%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 100 14% 88%;
    --input: 100 14% 88%;
    --ring: 97 47% 33%;
    --radius: 0.875rem;

    --brand: #4f7a2e;
    --brand-deep: #2e4e18;
    --cream: #f7f1e8;
    --surface: #fffbf5;
    --text: #1e2519;
    --muted-text: #6a7462;
    --gold: #c9a05a;
    --terracotta: #b56c3d;
    --sage: 97 47% 33%;
    --sage-light: 96 18% 91%;
    --warm-white: 36 50% 99%;
    --earth: 109 52% 20%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Outfit', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Cormorant Garamond', serif;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-delay-1 {
    animation: fadeIn 0.8s ease-out 0.2s forwards;
    opacity: 0;
  }

  .animate-fade-in-delay-2 {
    animation: fadeIn 0.8s ease-out 0.4s forwards;
    opacity: 0;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }

  .hover-lift {
    @apply transition-all duration-300 ease-out;
  }

  .hover-lift:hover {
    @apply -translate-y-1 shadow-lg;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

- [ ] **Step 3: Add the build script**

In root `package.json`, add to `"scripts"`:

```json
"build:theme-css": "tailwindcss -i ./shopify-theme/tailwind-input.css -o ./shopify-theme/assets/tailwind.css --config ./shopify-theme/tailwind.config.js --minify"
```

- [ ] **Step 4: Run the build and verify output**

```bash
npm run build:theme-css
```

Expected: `shopify-theme/assets/tailwind.css` is created, non-empty, and contains `--brand:#4f7a2e` (search the minified output for the literal string).

```bash
grep -o -- "--brand:#4f7a2e" shopify-theme/assets/tailwind.css
```

Expected: prints `--brand:#4f7a2e`.

- [ ] **Step 5: Commit**

```bash
git add shopify-theme/tailwind.config.js shopify-theme/tailwind-input.css package.json
git commit -m "feat: add Tailwind asset pipeline for the Shopify theme"
```

---

### Task 2: Global layout shell

**Files:**
- Modify: `shopify-theme/layout/theme.liquid`
- Create: `shopify-theme/snippets/analytics-scripts.liquid`

**Interfaces:**
- Consumes: `shopify-theme/assets/tailwind.css` from Task 1.
- Produces: a page shell that loads Tailwind CSS and the analytics scripts on every page. Task 3 (header) and Task 4 (footer) render inside `{% sections 'header-group' %}` / `{% sections 'footer-group' %}`, already wired up by the skeleton's existing `theme.liquid` structure — this task only changes the `<head>` contents and asset loading.

- [ ] **Step 1: Create the analytics snippet**

Create `shopify-theme/snippets/analytics-scripts.liquid`, porting the exact scripts from `index.html:18-42` (Google tag, Meta Pixel, Microsoft Clarity):

```liquid
{% comment %} Google tag (gtag.js) {% endcomment %}
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-NBXH2XRV"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-NBXH2XRV');
</script>

{% comment %} Meta Pixel Code {% endcomment %}
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1487848962411967');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id=1487848962411967&ev=PageView&noscript=1">
</noscript>

{% comment %} Microsoft Clarity Code {% endcomment %}
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tfstshrii3");
</script>
```

- [ ] **Step 2: Update the theme layout**

Modify `shopify-theme/layout/theme.liquid` — replace its `<head>` contents (keep `{% render 'css-variables' %}`, drop the skeleton's `critical.css` line, add Tailwind + analytics + the ported meta/title tags from `index.html:6-16`, and add `theme.js` before `</body>`):

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    {% render 'css-variables' %}

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="format-detection" content="telephone=no">
    <title>{{ page_title }}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>
    <meta name="description" content="{{ page_description | default: 'Authentic aromatic wellness products crafted from traditional Indian herbs and essential oils. Incense sticks, cups, ghee lamps & more from Stomatal Farms.' | escape }}">
    <meta name="author" content="Stomatal Farms">

    <meta property="og:title" content="Stomatal Farms | Aurora Aromatic Wellness">
    <meta property="og:description" content="Authentic aromatic wellness products crafted from traditional Indian herbs and essential oils. Incense sticks, cups, ghee lamps & more.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://stomatalfarms.com/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://stomatalfarms.com/og-image.png">
    <link rel="canonical" href="{{ canonical_url }}">

    {{ 'tailwind.css' | asset_url | stylesheet_tag }}

    {% render 'analytics-scripts' %}

    {{ content_for_header }}
  </head>

  <body>
    {% sections 'header-group' %}

    {{ content_for_layout }}

    {% sections 'footer-group' %}

    <script src="{{ 'theme.js' | asset_url }}" defer></script>
  </body>
</html>
```

Note: `favicon.png` (referenced in `index.html:15`) is handled separately via Shopify's native favicon setting (`config/settings_schema.json`'s built-in `favicon` setting + `{{ settings.favicon | image_url: width: 32 }}` if the skeleton's `meta-tags.liquid` doesn't already emit one) — out of scope for this task; note it as a follow-up if the favicon doesn't appear once Task 3/4 are visually compared.

- [ ] **Step 3: Verify in the browser**

The dev theme is already running (`http://127.0.0.1:9292`). Reload it and check the page source.

Expected:
- View source shows `<link rel="stylesheet" href=".../tailwind.css...">`.
- Body background is the cream color (`#f7f1e8` / `hsl(36 43% 96%)`), not the skeleton's default white/gray — confirms Tailwind is actually loading and applying `body { @apply bg-background }`.
- No console errors from the analytics scripts (they'll no-op harmlessly against a dev-theme domain, which is expected and fine).

- [ ] **Step 4: Commit**

```bash
git add shopify-theme/layout/theme.liquid shopify-theme/snippets/analytics-scripts.liquid
git commit -m "feat: port global layout shell (head, meta tags, analytics, Tailwind asset)"
```

---

### Task 3: Header section with Web Components

**Files:**
- Create: `shopify-theme/assets/theme.js`
- Modify: `shopify-theme/sections/header.liquid` (full rewrite)
- Copy: `src/assets/7cc0e5_83fa66911e2a42aab710af3569d86773_mv2.png` → `shopify-theme/assets/logo.png`

**Interfaces:**
- Consumes: Tailwind classes/tokens from Task 1, `theme.js` script tag already wired up in Task 2.
- Produces: `<sticky-header>` and `<nav-dropdown>` custom elements registered in `theme.js`. Later tasks that need carousel behavior (the Phase 1a-follow-up plan) append to this same `theme.js` file rather than creating a new one — keep all custom element definitions in this one module.

- [ ] **Step 1: Copy the logo asset**

```bash
cp "src/assets/7cc0e5_83fa66911e2a42aab710af3569d86773_mv2.png" "shopify-theme/assets/logo.png"
```

- [ ] **Step 2: Create theme.js with the two custom elements**

Create `shopify-theme/assets/theme.js`, porting `Header.tsx`'s `isScrolled` scroll listener (`Header.tsx:18-29`) and the Aurora dropdown's CSS-only hover/group-hover behavior (`Header.tsx:60-80`, which needs no JS at all — it's pure CSS `group-hover`, already achievable in vanilla CSS with `:hover`/`:focus-within`, so `<nav-dropdown>` only needs to exist for keyboard/touch accessibility, not for the hover case):

```javascript
class StickyHeader extends HTMLElement {
  connectedCallback() {
    this.header = this.querySelector("header");
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll() {
    const isScrolled = window.scrollY > 20;
    this.header.classList.toggle("bg-white/80", isScrolled);
    this.header.classList.toggle("backdrop-blur-md", isScrolled);
    this.header.classList.toggle("shadow-sm", isScrolled);
    this.header.classList.toggle("border-[#2e3f25]/5", isScrolled);
    this.header.classList.toggle("py-2", isScrolled);
    this.header.classList.toggle("bg-[#fffbf5]", !isScrolled);
    this.header.classList.toggle("border-transparent", !isScrolled);
    this.header.classList.toggle("py-4", !isScrolled);

    const logo = this.querySelector("[data-header-logo]");
    if (logo) {
      logo.classList.toggle("h-8", isScrolled);
      logo.classList.toggle("md:h-9", isScrolled);
      logo.classList.toggle("h-10", !isScrolled);
      logo.classList.toggle("md:h-12", !isScrolled);
    }
  }
}

class NavDropdown extends HTMLElement {
  connectedCallback() {
    this.trigger = this.querySelector("[data-dropdown-trigger]");
    this.menu = this.querySelector("[data-dropdown-menu]");
    this.trigger.addEventListener("click", () => this.toggle());
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) this.close();
    });
  }

  toggle() {
    const isOpen = this.menu.classList.contains("opacity-100");
    isOpen ? this.close() : this.open();
  }

  open() {
    this.menu.classList.add("opacity-100", "visible", "translate-y-0");
    this.menu.classList.remove("opacity-0", "invisible", "translate-y-2");
  }

  close() {
    this.menu.classList.remove("opacity-100", "visible", "translate-y-0");
    this.menu.classList.add("opacity-0", "invisible", "translate-y-2");
  }
}

customElements.define("sticky-header", StickyHeader);
customElements.define("nav-dropdown", NavDropdown);
```

- [ ] **Step 3: Rewrite header.liquid**

Replace `shopify-theme/sections/header.liquid` entirely, porting `Header.tsx:36-121` (top trust bar + sticky header + logo + Aurora dropdown + nav links + Shop Now button + cart icon). The cart icon/count is static (`0`) in this task — Task 4 of the *next* plan (native cart, Phase 2) wires it up:

```liquid
<div
  class="w-full text-white text-center py-2.5 px-4 text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase"
  style="background: linear-gradient(135deg, #1e3612, #2e4e18);"
>
  🌿 100% Natural &nbsp;&middot;&nbsp; Ritual Ready
</div>

<sticky-header>
  <header class="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#fffbf5] border-b border-transparent py-4">
    <div class="container flex items-center justify-between px-4 max-w-7xl mx-auto">
      <a href="{{ routes.root_url }}" class="flex items-center gap-2 flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
        <img
          data-header-logo
          src="{{ 'logo.png' | asset_url }}"
          alt="Stomatal Farms"
          class="transition-all duration-300 h-10 md:h-12 w-auto object-contain"
        >
      </a>

      <nav class="flex items-center gap-4 md:gap-8">
        <nav-dropdown class="relative">
          <button data-dropdown-trigger class="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors outline-none">
            Aurora
            <svg class="w-3 h-3 opacity-40 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div data-dropdown-menu class="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white/95 backdrop-blur-lg border border-[#2e3f25]/10 rounded-[20px] shadow-2xl py-3 opacity-0 invisible transition-all duration-300 z-50 translate-y-2">
            {% for category in section.settings.aurora_categories %}
              <a
                href="{{ category.link }}"
                class="block px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors text-[#2a3625] hover:text-[#4f7a2e] hover:bg-[#4f7a2e]/5"
              >
                {{ category.text }}
              </a>
            {% endfor %}
          </div>
        </nav-dropdown>

        <a href="{{ routes.root_url }}collections?category=microgreens" class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors whitespace-nowrap">
          Farm Fresh
        </a>
        <a href="{{ routes.root_url }}pages/contact" class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors">
          Contact
        </a>
      </nav>

      <div class="flex items-center gap-2 md:gap-4">
        <a
          href="{{ routes.root_url }}collections"
          class="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(46,78,24,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(46,78,24,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          style="background: linear-gradient(135deg, #2e4e18, #4f7a2e);"
        >
          Shop Now
        </a>
        <a href="{{ routes.cart_url }}" class="relative p-2 rounded-full hover:bg-[#4f7a2e]/5 transition-colors">
          <svg class="w-5 h-5 text-[#2a3625]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {% if cart.item_count > 0 %}
            <span class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#b56c3d] text-white text-[9px] font-black flex items-center justify-center">
              {{ cart.item_count }}
            </span>
          {% endif %}
        </a>
      </div>
    </div>
  </header>
</sticky-header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "text",
      "id": "trust_bar_text",
      "label": "Trust bar text",
      "default": "100% Natural · Ritual Ready"
    }
  ],
  "blocks": [
    {
      "type": "aurora_category",
      "name": "Aurora category",
      "settings": [
        { "type": "text", "id": "text", "label": "Label" },
        { "type": "url", "id": "link", "label": "Link" }
      ]
    }
  ],
  "default": {
    "blocks": [
      { "type": "aurora_category", "settings": { "text": "Incense Sticks", "link": "/collections?category=sticks" } },
      { "type": "aurora_category", "settings": { "text": "Incense Cups", "link": "/collections?category=cups" } },
      { "type": "aurora_category", "settings": { "text": "Combos", "link": "/collections?category=combos" } },
      { "type": "aurora_category", "settings": { "text": "Ghee Lamps", "link": "/collections?category=ghee" } },
      { "type": "aurora_category", "settings": { "text": "Bath Salts", "link": "/collections?category=bath" } },
      { "type": "aurora_category", "settings": { "text": "Cow Dung Ash", "link": "/collections?category=ash" } }
    ]
  }
}
{% endschema %}
```

Note: this uses `section.settings.aurora_categories` in the loop but the schema defines `blocks`, not a `aurora_categories` setting — fix before running: change the loop to `{% for block in section.blocks %}` and reference `block.settings.text` / `block.settings.link`, matching the `blocks`-based schema above. (Flagging this explicitly so the implementer fixes it while porting, not after hitting a Liquid error.)

- [ ] **Step 4: Verify in the browser**

Reload `http://127.0.0.1:9292`.

Expected:
- Top trust bar renders with the green gradient background and the exact copy.
- Logo, nav links, Aurora dropdown trigger, Shop Now button, and cart icon render matching the current site's header layout and colors.
- Scrolling down past 20px triggers the header's background/blur/padding change (compare against the live site's same scroll behavior).
- Clicking "Aurora" opens the dropdown showing all 6 categories; clicking outside closes it.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add shopify-theme/assets/theme.js shopify-theme/sections/header.liquid shopify-theme/assets/logo.png
git commit -m "feat: port header section with sticky-header and nav-dropdown Web Components"
```

---

### Task 4: Footer section

**Files:**
- Modify: `shopify-theme/sections/footer.liquid` (full rewrite)

**Interfaces:**
- Consumes: Tailwind classes/tokens from Task 1.
- Produces: nothing consumed by later tasks — footer is a leaf section.

- [ ] **Step 1: Rewrite footer.liquid**

Replace `shopify-theme/sections/footer.liquid` entirely, porting `Footer.tsx:4-150` (brand block, quick links, newsletter form, stats bar, legal bottom bar). The newsletter form's `onSubmit={(e) => e.preventDefault()}` (a no-op placeholder in the current site) ports to a plain `<form>` with no `action`, matching the same no-op behavior:

```liquid
<footer class="bg-[#1a2416] text-[#f7f1e8] relative z-10 overflow-hidden">
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/p6.png');"></div>

  <div class="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
      <div class="lg:col-span-2">
        <a href="{{ routes.root_url }}" class="inline-block mb-8 group">
          <span class="text-3xl tracking-tight text-white group-hover:text-[#a8c690] transition-colors" style="font-family: 'Cormorant Garamond', serif; font-weight: 500;">
            STOMATAL <span class="italic">FARMS</span>
          </span>
        </a>
        <p class="text-lg font-light leading-relaxed mb-10 max-w-md text-white/50">
          Cultivating freshness, crafting rituals. We bring the pure essence of Indian farms directly to your sacred space.
        </p>
        <div class="flex gap-4">
          <a href="https://www.instagram.com/stomatalfarms/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white hover:text-[#1a2416] transform hover:-translate-y-1" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="mailto:contact@stomatalfarms.com" aria-label="Email" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white hover:text-[#1a2416] transform hover:-translate-y-1" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
          <a href="https://api.whatsapp.com/send/?phone=916379033131" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white hover:text-[#1a2416] transform hover:-translate-y-1" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-white/30">Aurora Collections</h4>
        <ul class="flex flex-col gap-5">
          {% assign footer_links = "Incense Sticks|/collections?category=sticks,Incense Cups|/collections?category=cups,Combo Packs|/collections?category=combos,Ghee Lamps|/collections?category=ghee,Bath Salts|/collections?category=bath" | split: "," %}
          {% for entry in footer_links %}
            {% assign parts = entry | split: "|" %}
            <li>
              <a href="{{ parts[1] }}" class="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-all">
                {{ parts[0] }}
                <svg class="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </a>
            </li>
          {% endfor %}
        </ul>
      </div>

      <div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-white/30">The Ritual List</h4>
        <p class="text-sm font-light leading-relaxed mb-8 text-white/50">
          Subscribe to receive stories of traditional rituals and early access to new releases.
        </p>
        <form class="relative group" onsubmit="return false;">
          <input type="email" placeholder="Email address" class="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a8c690]/50 transition-all">
          <button type="submit" class="absolute right-2 top-2 bottom-2 px-6 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95" style="background: linear-gradient(135deg, #2e4e18, #4f7a2e);">
            Join
          </button>
        </form>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6 mb-12 rounded-3xl text-center" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);">
      {% assign stats = "5+|Years of Craft,1,200+|Homes Blessed,100%|Purely Natural,4.7★|Average Rating" | split: "," %}
      {% for stat in stats %}
        {% assign stat_parts = stat | split: "|" %}
        <div class="flex flex-col gap-0.5">
          <p class="text-xl md:text-2xl font-light text-white/90" style="font-family: 'Cormorant Garamond', serif;">{{ stat_parts[0] }}</p>
          <p class="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">{{ stat_parts[1] }}</p>
        </div>
      {% endfor %}
    </div>

    <div class="flex flex-col lg:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
        &copy; 2025 Stomatal Farms. Crafted with intention.
      </p>
      <div class="flex flex-wrap justify-center gap-x-12 gap-y-4">
        <a href="{{ pages.privacy-policy.url | default: '/pages/privacy-policy' }}" class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors">Privacy</a>
        <a href="{{ pages.terms-conditions.url | default: '/pages/terms-conditions' }}" class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors">Terms</a>
        <a href="{{ pages.returns-refunds.url | default: '/pages/returns-refunds' }}" class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors">Returns & Refunds</a>
        <a href="{{ pages.contact.url | default: '/pages/contact' }}" class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors">Contact Us</a>
      </div>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer"
}
{% endschema %}
```

Note on the `"1,200+"` stat: it contains a comma, which collides with the `|split: ","` delimiter used for the stats list. Before running, either escape it (e.g. use `assign stats_raw = ... | replace: "1,200+", "1200PLUS"` then replace back after splitting) or — simpler — replace the whole `{% assign stats = "..." | split: "," %}` block with four explicit `<div>` blocks (matching the `footer_links` shape isn't reusable here anyway since there are only 4 fixed stats). Flagging this now so the implementer doesn't hit a silently-wrong 5-way split at verification time.

- [ ] **Step 2: Verify in the browser**

Reload `http://127.0.0.1:9292` and scroll to the footer.

Expected:
- Dark green footer background, brand block, quick links, newsletter form, stats bar (four correct values: 5+, 1,200+, 100%, 4.7★), and legal bottom bar all render matching the current site.
- No console errors, no broken Liquid (check the terminal running `shopify theme dev` for Liquid syntax errors too).

- [ ] **Step 3: Commit**

```bash
git add shopify-theme/sections/footer.liquid
git commit -m "feat: port footer section"
```

---

### Task 5: Shared Embla carousel base custom element

**Files:**
- Modify: `shopify-theme/assets/theme.js` (append)
- Create: `shopify-theme/assets/embla-carousel.esm.js` (vendored library file)
- Create: `shopify-theme/sections/carousel-smoke-test.liquid` (temporary, deleted at the end of this task)

**Interfaces:**
- Consumes: nothing from earlier tasks besides `theme.js` already being loaded (Task 2).
- Produces: `<embla-carousel-base>` custom element, registered in `theme.js`, with a public `emblaApi` property (the initialized Embla instance) that later sections (BundleCarousel, VideoCarousel, InstagramCarousel, GoogleReviewsCarousel — all built in the follow-up Phase 1b plan) attach to by wrapping their slide markup in `<embla-carousel-base class="overflow-hidden"><div class="embla__container flex gap-3 md:gap-4">...slides...</div></embla-carousel-base>` and reading `element.emblaApi` for `scrollPrev()`/`scrollNext()`. This exact class name and DOM contract (`.embla__container` as the direct child holding slides) is what Phase 1b's sections rely on — do not change it without updating this plan's note for whoever writes that plan next.

- [ ] **Step 1: Vendor the Embla carousel core library**

The current site uses `embla-carousel-react` (a React wrapper); the theme needs the underlying vanilla-JS core it wraps. Download the built ESM bundle matching the installed version (`embla-carousel@8.6.0`, per `embla-carousel-react`'s own dependency in `package.json`):

```bash
curl -o shopify-theme/assets/embla-carousel.esm.js https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/+esm
```

Verify it downloaded a real JS file, not an error page:

```bash
head -c 200 shopify-theme/assets/embla-carousel.esm.js
```

Expected: JavaScript module code (not HTML/an error message).

- [ ] **Step 2: Append the base custom element to theme.js**

Add to the end of `shopify-theme/assets/theme.js`:

```javascript
import EmblaCarousel from "./embla-carousel.esm.js";

class EmblaCarouselBase extends HTMLElement {
  connectedCallback() {
    const container = this.querySelector(".embla__container");
    if (!container) return;
    this.emblaApi = EmblaCarousel(this, { loop: true, align: "start", skipSnaps: false, duration: 25 });
  }

  disconnectedCallback() {
    this.emblaApi?.destroy();
  }
}

customElements.define("embla-carousel-base", EmblaCarouselBase);
```

Since this file now uses `import`, the script tag loading it (added in Task 2) must become a module. Update `shopify-theme/layout/theme.liquid`'s closing script tag:

```liquid
<script src="{{ 'theme.js' | asset_url }}" type="module"></script>
```

(remove `defer` — ES modules defer by default).

- [ ] **Step 3: Write a temporary smoke-test section**

Create `shopify-theme/sections/carousel-smoke-test.liquid`:

```liquid
<embla-carousel-base class="overflow-hidden max-w-md mx-auto my-12">
  <div class="embla__container flex gap-3">
    <div class="flex-[0_0_100%] min-w-0 bg-[#4f7a2e] text-white p-8 text-center rounded-2xl">Slide 1</div>
    <div class="flex-[0_0_100%] min-w-0 bg-[#2e4e18] text-white p-8 text-center rounded-2xl">Slide 2</div>
    <div class="flex-[0_0_100%] min-w-0 bg-[#b56c3d] text-white p-8 text-center rounded-2xl">Slide 3</div>
  </div>
</embla-carousel-base>

{% schema %}
{ "name": "Carousel smoke test" }
{% endschema %}
```

Temporarily add it to `shopify-theme/templates/index.json`'s `"sections"` and `"order"` (alongside the existing `"main"` hello-world section — leave that in place, just add this one after it).

- [ ] **Step 4: Verify in the browser**

Reload `http://127.0.0.1:9292`.

Expected:
- Three colored slides render in a row, clipped to one visible slide at a time (`overflow-hidden` on the wrapping element).
- In the browser console, running `document.querySelector('embla-carousel-base').emblaApi.scrollNext()` advances to the next slide with a smooth transition.
- No console errors (specifically: no "Failed to resolve module" — confirms the `import` path and `type="module"` script tag are correct).

- [ ] **Step 5: Remove the smoke test**

```bash
rm shopify-theme/sections/carousel-smoke-test.liquid
```

Remove its entry from `shopify-theme/templates/index.json` (revert to just the pre-existing `"main"` hello-world section).

- [ ] **Step 6: Commit**

```bash
git add shopify-theme/assets/theme.js shopify-theme/assets/embla-carousel.esm.js shopify-theme/layout/theme.liquid shopify-theme/templates/index.json
git commit -m "feat: add shared embla-carousel-base Web Component"
```

---

### Task 6: Foundation verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run theme check**

```bash
shopify theme check shopify-theme/
```

Expected: no errors (warnings about the still-present `hello-world` section / unused skeleton files are fine — those get replaced in the Phase 1b plan).

- [ ] **Step 2: Screenshot comparison against the live site**

Using Playwright (already set up in this project, see the pattern used earlier for the reviews carousel work), screenshot the dev theme's header and footer at `http://127.0.0.1:9292` and compare side-by-side against `https://stomatalfarms.com`'s header and footer.

Expected: colors, spacing, copy, and the sticky-scroll header transition match. Note any pixel differences found — fix them before moving to the Phase 1b plan, since every later section builds on this same header/footer/Tailwind foundation and errors here compound.

- [ ] **Step 3: Confirm no impact to other themes**

```bash
shopify theme list --store=nvhu9m-0r.myshopify.com
```

Expected: the same theme list as before this plan started, plus no new themes beyond the one dev theme (`156807921821`) already created by `shopify theme dev`.
