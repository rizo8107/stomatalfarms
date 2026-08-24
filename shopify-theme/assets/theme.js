// Class lists are declared in Liquid and read from data attributes, never
// written literally here: Tailwind's content scanner only reads *.liquid, so a
// class that exists only in this file never makes it into the compiled CSS.
function splitClasses(value) {
  return (value || "").split(" ").filter(Boolean);
}

function swapClasses(element, remove, add) {
  if (remove.length) element.classList.remove.apply(element.classList, remove);
  if (add.length) element.classList.add.apply(element.classList, add);
}

class StickyHeader extends HTMLElement {
  connectedCallback() {
    this.header = this.querySelector("header");
    this.logo = this.querySelector("[data-header-logo]");
    this.headerScrolled = splitClasses(this.dataset.headerScrolled);
    this.headerTop = splitClasses(this.dataset.headerTop);
    this.logoScrolled = splitClasses(this.dataset.logoScrolled);
    this.logoTop = splitClasses(this.dataset.logoTop);
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll() {
    if (!this.header) return;
    const isScrolled = window.scrollY > 20;
    swapClasses(
      this.header,
      isScrolled ? this.headerTop : this.headerScrolled,
      isScrolled ? this.headerScrolled : this.headerTop
    );
    if (this.logo) {
      swapClasses(
        this.logo,
        isScrolled ? this.logoTop : this.logoScrolled,
        isScrolled ? this.logoScrolled : this.logoTop
      );
    }
  }
}

class NavDropdown extends HTMLElement {
  connectedCallback() {
    this.trigger = this.querySelector("[data-dropdown-trigger]");
    this.menu = this.querySelector("[data-dropdown-menu]");
    if (!this.trigger || !this.menu) return;
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.trigger.addEventListener("click", () => this.toggle());
    document.addEventListener("click", this.onDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.onDocumentClick);
  }

  onDocumentClick(e) {
    if (!this.contains(e.target)) this.close();
  }

  toggle() {
    const isOpen = this.menu.hasAttribute("data-open");
    isOpen ? this.close() : this.open();
  }

  open() {
    this.menu.setAttribute("data-open", "");
    this.setAttribute("data-open", "");
  }

  close() {
    this.menu.removeAttribute("data-open");
    this.removeAttribute("data-open");
  }
}

customElements.define("sticky-header", StickyHeader);
customElements.define("nav-dropdown", NavDropdown);

class EmblaCarouselBase extends HTMLElement {
  async connectedCallback() {
    const container = this.querySelector(".embla__container");
    if (!container) return;
    const { default: EmblaCarousel } = await import("./embla-carousel.esm.js");
    this.emblaApi = EmblaCarousel(this, { loop: true, align: "start", skipSnaps: false, duration: 25 });
  }

  disconnectedCallback() {
    this.emblaApi?.destroy();
  }
}

customElements.define("embla-carousel-base", EmblaCarouselBase);

class ComparisonTabs extends HTMLElement {
  connectedCallback() {
    this.activeClass = (this.dataset.activeClass || "").split(" ").filter(Boolean);
    this.idleClass = (this.dataset.idleClass || "").split(" ").filter(Boolean);
    this.triggers = Array.from(this.querySelectorAll("[data-tab-trigger]"));
    this.panels = Array.from(this.querySelectorAll("[data-tab-panel]"));
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => this.select(trigger.dataset.tabTrigger));
    });
  }

  select(id) {
    this.triggers.forEach((trigger) => {
      const isActive = trigger.dataset.tabTrigger === id;
      trigger.classList.remove(...(isActive ? this.idleClass : this.activeClass));
      trigger.classList.add(...(isActive ? this.activeClass : this.idleClass));
      trigger.setAttribute("aria-selected", String(isActive));
    });
    this.panels.forEach((panel) => {
      panel.toggleAttribute("hidden", panel.dataset.tabPanel !== id);
    });
  }
}

customElements.define("comparison-tabs", ComparisonTabs);

const LUCIDE_STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function lucideStar(className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("class", "lucide lucide-star " + className);
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", LUCIDE_STAR_PATH);
  svg.appendChild(path);
  return svg;
}

// Mirrors relativeTimeFrom() in src/lib/googlePlaces.ts
function relativeTimeFrom(publishedAt) {
  const days = Math.floor((Date.now() - new Date(publishedAt).getTime()) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return days + " day" + (days === 1 ? "" : "s") + " ago";
  const months = Math.floor(days / 30);
  if (months < 12) return months + " month" + (months === 1 ? "" : "s") + " ago";
  const years = Math.floor(months / 12);
  return years + " year" + (years === 1 ? "" : "s") + " ago";
}

class GoogleReviewsCarousel extends HTMLElement {
  async connectedCallback() {
    this.avatarColors = (this.dataset.avatarColors || "").split(" ").filter(Boolean);
    this.starOn = this.dataset.starOn || "";
    this.starOff = this.dataset.starOff || "";
    this.summaryStarOn = this.dataset.summaryStarOn || "";
    this.summaryStarOff = this.dataset.summaryStarOff || "";
    this.track = this.querySelector("[data-review-track]");
    this.viewport = this.track ? this.track.parentElement : null;
    this.cardTemplate = this.querySelector("[data-review-card-template]");
    this.swipeHint = this.querySelector("[data-swipe-hint]");
    this.starFilter = "all";
    this.sortMode = "newest";
    this.reviews = [];

    const starSelect = this.querySelector("[data-star-filter]");
    if (starSelect) {
      starSelect.addEventListener("change", (e) => {
        this.starFilter = e.target.value;
        this.renderCards();
      });
    }
    const sortSelect = this.querySelector("[data-sort-mode]");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortMode = e.target.value;
        this.renderCards();
      });
    }
    const prev = this.querySelector("[data-carousel-prev]");
    if (prev) prev.addEventListener("click", () => this.emblaApi && this.emblaApi.scrollPrev());
    const next = this.querySelector("[data-carousel-next]");
    if (next) next.addEventListener("click", () => this.emblaApi && this.emblaApi.scrollNext());

    await this.load();
  }

  disconnectedCallback() {
    this.stopAutoplay();
    if (this.emblaApi) this.emblaApi.destroy();
  }

  async load() {
    // Live data first. If that fetch fails — most often CORS, since the API is
    // on a different origin than the storefront — fall back to the snapshot
    // baked into the theme so the section still renders real reviews.
    let data = await this.fetchJson(this.dataset.endpoint);
    if (!data && this.dataset.fallbackEndpoint) {
      data = await this.fetchJson(this.dataset.fallbackEndpoint);
    }
    if (!data) {
      // Matches React: render nothing when there is nothing to show.
      this.hidden = true;
      return;
    }

    this.reviews = (data.reviews || []).map((row) => ({
      id: row.external_review_id,
      authorName: row.author_name,
      authorPhotoUrl: row.author_photo_url,
      rating: row.rating,
      text: row.review_text,
      relativeTime: relativeTimeFrom(row.published_at),
      publishTime: row.published_at,
    }));

    this.renderSummary(Number(data.rating) || 0, Number(data.totalReviews) || 0);
    this.renderCards();
    await this.initCarousel();
  }

  async fetchJson(url) {
    if (!url) return null;
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  renderSummary(rating, totalReviews) {
    const starsEl = this.querySelector("[data-summary-stars]");
    if (starsEl) {
      starsEl.replaceChildren();
      const filled = Math.round(rating || 5);
      for (let i = 0; i < 5; i++) {
        starsEl.appendChild(lucideStar(i < filled ? this.summaryStarOn : this.summaryStarOff));
      }
    }
    const ratingEl = this.querySelector("[data-summary-rating]");
    if (ratingEl) ratingEl.textContent = rating > 0 ? rating.toFixed(1) : "0.0";
    const totalEl = this.querySelector("[data-summary-total]");
    if (totalEl) {
      const count = totalReviews > 0 ? totalReviews.toLocaleString() : "0";
      totalEl.textContent = "· " + count + "+ reviews";
    }
  }

  visibleReviews() {
    let result = this.reviews;
    if (this.starFilter !== "all") {
      const wanted = Number(this.starFilter);
      result = result.filter((review) => review.rating === wanted);
    }
    return result.slice().sort((a, b) => {
      if (this.sortMode === "highest") return b.rating - a.rating;
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    });
  }

  renderCards() {
    if (!this.track || !this.cardTemplate) return;
    const reviews = this.visibleReviews();
    this.track.replaceChildren.apply(this.track, reviews.map((review) => this.buildCard(review)));
    if (this.swipeHint) this.swipeHint.hidden = reviews.length === 0;
    if (this.emblaApi) this.emblaApi.reInit();
  }

  buildCard(review) {
    const card = this.cardTemplate.content.cloneNode(true);

    const image = card.querySelector("[data-avatar-image]");
    const fallback = card.querySelector("[data-avatar-fallback]");
    fallback.textContent = this.initials(review.authorName);
    fallback.classList.add(this.avatarColor(review.authorName));
    if (review.authorPhotoUrl) {
      image.src = review.authorPhotoUrl;
      image.alt = review.authorName;
      image.hidden = false;
      // Radix Avatar keeps the initials fallback when the photo fails to load.
      image.addEventListener("error", () => { image.hidden = true; }, { once: true });
      image.addEventListener("load", () => { fallback.hidden = true; }, { once: true });
    }

    card.querySelector("[data-author]").textContent = review.authorName;

    const stars = card.querySelector("[data-stars]");
    for (let i = 0; i < 5; i++) {
      stars.appendChild(lucideStar("w-3 h-3 " + (i < review.rating ? this.starOn : this.starOff)));
    }

    const textEl = card.querySelector("[data-text]");
    const toggle = card.querySelector("[data-toggle]");
    const isLong = review.text.length > 140;
    let expanded = false;
    const paint = () => {
      textEl.textContent = expanded || !isLong ? review.text : review.text.slice(0, 140) + "...";
      toggle.textContent = expanded ? "Less" : "More";
    };
    if (isLong) {
      toggle.hidden = false;
      toggle.addEventListener("click", () => { expanded = !expanded; paint(); });
    }
    paint();

    card.querySelector("[data-relative-time]").textContent = review.relativeTime;
    return card;
  }

  // Mirrors avatarColor() in src/components/GoogleReviewsCarousel.tsx
  avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }

  initials(name) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0] ? parts[0].charAt(0) : "";
    const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + second).toUpperCase();
  }

  async initCarousel() {
    if (!this.viewport || this.emblaApi) return;
    const module = await import("./embla-carousel.esm.js");
    this.emblaApi = module.default(this.viewport, { loop: true, align: "start", skipSnaps: false, duration: 25 });
    // Stands in for embla-carousel-autoplay: delay 2800, stopOnInteraction false, stopOnMouseEnter true.
    this.startAutoplay();
    this.addEventListener("mouseenter", () => this.stopAutoplay());
    this.addEventListener("mouseleave", () => this.startAutoplay());
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => {
      if (this.emblaApi) this.emblaApi.scrollNext();
    }, 2800);
  }

  stopAutoplay() {
    if (this.autoplayTimer) window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
}

customElements.define("google-reviews-carousel", GoogleReviewsCarousel);

class ProductCard extends HTMLElement {
  connectedCallback() {
    this.options = Array.from(this.querySelectorAll("[data-variant-option]"));
    this.priceEl = this.querySelector("[data-current-price]");
    this.originalPriceEl = this.querySelector("[data-original-price]");
    this.discountBadge = this.querySelector("[data-discount-badge]");

    this.options.forEach((option) => {
      option.addEventListener("click", (event) => {
        // The card is wrapped in a link; selecting a variant must not navigate.
        event.preventDefault();
        event.stopPropagation();
        this.select(option);
      });
    });

    // The card sits inside a link, so the CTA must not navigate. preventDefault
    // is enough — the wrapping <a> honours defaultPrevented. Deliberately NOT
    // stopPropagation: the drawer's document-level handler needs this event.
    this.cta = this.querySelector("[data-product-cta]");
    if (this.cta) {
      this.cta.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  }

  select(option) {
    this.options.forEach((other) => {
      const isSelected = other === option;
      other.style.background = isSelected ? "#4f7a2e" : "transparent";
      other.style.color = isSelected ? "#fff" : "#6a7462";
      other.style.borderColor = isSelected ? "#4f7a2e" : "rgba(46,63,37,0.20)";
      other.setAttribute("aria-pressed", String(isSelected));
    });

    const price = option.dataset.price;
    const compareAt = option.dataset.compareAtPrice;
    const discountPct = Number(option.dataset.discountPct) || 0;

    if (this.priceEl) this.priceEl.textContent = "₹" + price;

    if (this.originalPriceEl) {
      const showCompare = discountPct > 0 && compareAt;
      this.originalPriceEl.textContent = "₹" + (compareAt || "");
      this.originalPriceEl.hidden = !showCompare;
    }

    if (this.discountBadge) {
      this.discountBadge.textContent = discountPct + "% OFF";
      this.discountBadge.hidden = discountPct <= 0;
    }

    if (this.cta && this.cta.hasAttribute("data-ajax-add")) {
      this.cta.dataset.variantId = option.dataset.variantId;
    }
  }
}

customElements.define("product-card", ProductCard);

class BundleCarousel extends HTMLElement {
  async connectedCallback() {
    this.viewport = this.querySelector("[data-carousel-viewport]");
    this.cards = Array.from(this.querySelectorAll("[data-bundle-card]"));
    this.dots = Array.from(this.querySelectorAll("[data-carousel-dot]"));
    if (!this.viewport) return;

    const module = await import("./embla-carousel.esm.js");
    this.emblaApi = module.default(this.viewport, { loop: true, align: "center" });

    const prev = this.querySelector("[data-carousel-prev]");
    if (prev) prev.addEventListener("click", () => this.emblaApi.scrollPrev());
    const next = this.querySelector("[data-carousel-next]");
    if (next) next.addEventListener("click", () => this.emblaApi.scrollNext());
    this.dots.forEach((dot) => {
      dot.addEventListener("click", () => this.emblaApi.scrollTo(Number(dot.dataset.index)));
    });

    this.onSelect = () => this.paint(this.emblaApi.selectedScrollSnap());
    this.emblaApi.on("select", this.onSelect);
    this.onSelect();
  }

  disconnectedCallback() {
    if (this.emblaApi) {
      this.emblaApi.off("select", this.onSelect);
      this.emblaApi.destroy();
    }
  }

  paint(activeIndex) {
    this.cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.classList.toggle("border-[#f5c842]/30", isActive);
      card.classList.toggle("shadow-xl", isActive);
      card.classList.toggle("shadow-black/50", isActive);
      card.classList.toggle("border-white/5", !isActive);
    });
    this.dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("w-6", isActive);
      dot.classList.toggle("bg-[#f5c842]", isActive);
      dot.classList.toggle("w-1.5", !isActive);
      dot.classList.toggle("bg-white/20", !isActive);
      dot.classList.toggle("hover:bg-white/40", !isActive);
    });
  }
}

customElements.define("bundle-carousel", BundleCarousel);

class FaqAccordion extends HTMLElement {
  connectedCallback() {
    this.items = Array.from(this.querySelectorAll("[data-faq-item]"));
    this.openIndex = null;
    this.classSets = {
      item: [splitClasses(this.dataset.itemOpen), splitClasses(this.dataset.itemClosed)],
      question: [splitClasses(this.dataset.questionOpen), splitClasses(this.dataset.questionClosed)],
      chevron: [splitClasses(this.dataset.chevronOpen), splitClasses(this.dataset.chevronClosed)],
      panel: [splitClasses(this.dataset.panelOpen), splitClasses(this.dataset.panelClosed)],
    };
    this.items.forEach((item, index) => {
      const trigger = item.querySelector("[data-faq-trigger]");
      if (!trigger) return;
      // One panel open at a time; clicking the open one closes it.
      trigger.addEventListener("click", () => this.paint(this.openIndex === index ? null : index));
    });
  }

  paint(openIndex) {
    this.openIndex = openIndex;
    this.items.forEach((item, index) => {
      const isOpen = index === openIndex;
      const apply = (element, key) => {
        if (!element) return;
        const [open, closed] = this.classSets[key];
        swapClasses(element, isOpen ? closed : open, isOpen ? open : closed);
      };

      apply(item, "item");
      apply(item.querySelector("[data-faq-question]"), "question");
      apply(item.querySelector("[data-faq-chevron]"), "chevron");
      apply(item.querySelector("[data-faq-panel]"), "panel");

      const trigger = item.querySelector("[data-faq-trigger]");
      if (trigger) trigger.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

customElements.define("faq-accordion", FaqAccordion);

class InstagramCarousel extends HTMLElement {
  async connectedCallback() {
    this.viewport = this.querySelector("[data-carousel-viewport]");
    if (!this.viewport) return;

    const module = await import("./embla-carousel.esm.js");
    this.emblaApi = module.default(this.viewport, { loop: true, align: "center", skipSnaps: false });

    const prev = this.querySelector("[data-carousel-prev]");
    if (prev) prev.addEventListener("click", () => this.emblaApi.scrollPrev());
    const next = this.querySelector("[data-carousel-next]");
    if (next) next.addEventListener("click", () => this.emblaApi.scrollNext());

    // Stands in for embla-carousel-autoplay: delay 3200, stopOnInteraction false, stopOnMouseEnter true.
    this.startAutoplay();
    this.addEventListener("mouseenter", () => this.stopAutoplay());
    this.addEventListener("mouseleave", () => this.startAutoplay());
  }

  disconnectedCallback() {
    this.stopAutoplay();
    if (this.emblaApi) this.emblaApi.destroy();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => {
      if (this.emblaApi) this.emblaApi.scrollNext();
    }, 3200);
  }

  stopAutoplay() {
    if (this.autoplayTimer) window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
}

customElements.define("instagram-carousel", InstagramCarousel);

class VideoCarousel extends HTMLElement {
  async connectedCallback() {
    this.viewport = this.querySelector("[data-carousel-viewport]");
    this.slides = Array.from(this.querySelectorAll("[data-video-slide]"));
    this.dots = Array.from(this.querySelectorAll("[data-carousel-dot]"));
    this.popup = this.querySelector("[data-video-popup]");
    this.popupVideo = this.querySelector("[data-popup-video]");
    if (!this.viewport) return;

    this.slides.forEach((slide) => {
      slide.addEventListener("click", () => this.openPopup(slide.dataset.src));
    });
    this.querySelectorAll("[data-carousel-prev]").forEach((button) => {
      button.addEventListener("click", () => this.scroll("prev"));
    });
    this.querySelectorAll("[data-carousel-next]").forEach((button) => {
      button.addEventListener("click", () => this.scroll("next"));
    });
    this.dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        // Autoplay stops on interaction here (stopOnInteraction: true upstream).
        this.stopAutoplay();
        if (this.emblaApi) this.emblaApi.scrollTo(Number(dot.dataset.index));
      });
    });

    if (this.popup) {
      this.popup.addEventListener("click", () => this.closePopup());
      const inner = this.querySelector("[data-video-popup-inner]");
      if (inner) inner.addEventListener("click", (event) => event.stopPropagation());
      const close = this.querySelector("[data-video-popup-close]");
      if (close) close.addEventListener("click", () => this.closePopup());
    }
    this.onKeydown = (event) => {
      if (event.key === "Escape") this.closePopup();
    };

    const module = await import("./embla-carousel.esm.js");
    this.emblaApi = module.default(this.viewport, { loop: true, align: "center", skipSnaps: false });

    this.onSelect = () => this.paint(this.emblaApi.selectedScrollSnap());
    this.emblaApi.on("select", this.onSelect);
    this.onSelect();

    // Stands in for embla-carousel-autoplay: delay 5000, stopOnInteraction true, stopOnMouseEnter true.
    this.startAutoplay();
    this.addEventListener("mouseenter", () => this.stopAutoplay());
    this.addEventListener("mouseleave", () => {
      if (!this.autoplayStopped) this.startAutoplay();
    });
  }

  disconnectedCallback() {
    this.stopAutoplay();
    document.removeEventListener("keydown", this.onKeydown);
    if (this.emblaApi) {
      this.emblaApi.off("select", this.onSelect);
      this.emblaApi.destroy();
    }
  }

  scroll(direction) {
    this.autoplayStopped = true;
    this.stopAutoplay();
    if (!this.emblaApi) return;
    if (direction === "prev") this.emblaApi.scrollPrev();
    else this.emblaApi.scrollNext();
  }

  // Only the active slide plays; the rest rewind and pause.
  paint(activeIndex) {
    this.slides.forEach((slide, index) => {
      const video = slide.querySelector("[data-preview]");
      if (!video) return;
      if (index === activeIndex) {
        const played = video.play();
        if (played && played.catch) played.catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
    this.dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("w-6", isActive);
      dot.classList.toggle("bg-[#a8c690]", isActive);
      dot.classList.toggle("w-1.5", !isActive);
      dot.classList.toggle("bg-white/20", !isActive);
      dot.classList.toggle("hover:bg-white/40", !isActive);
    });
  }

  openPopup(src) {
    if (!this.popup || !this.popupVideo || !src) return;
    this.popupVideo.src = src;
    this.popup.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.onKeydown);
    const played = this.popupVideo.play();
    if (played && played.catch) played.catch(() => {});
  }

  closePopup() {
    if (!this.popup || this.popup.hidden) return;
    this.popupVideo.pause();
    this.popupVideo.removeAttribute("src");
    this.popup.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.onKeydown);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => {
      if (this.emblaApi) this.emblaApi.scrollNext();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayTimer) window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
}

customElements.define("video-carousel", VideoCarousel);

// Mirrors handleSubmit() in src/pages/Contact.tsx: compose the enquiry as a
// WhatsApp message, show a brief "Sending..." state, then open wa.me.
class WhatsappContactForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector("form");
    this.submit = this.querySelector("[data-submit]");
    if (!this.form || !this.submit) return;
    this.form.addEventListener("submit", (event) => this.onSubmit(event));
  }

  onSubmit(event) {
    event.preventDefault();
    if (!this.form.reportValidity()) return;

    const data = new FormData(this.form);
    const value = (name) => (data.get(name) || "").toString().trim();

    const message =
      "*New Inquiry / Bulk Order Request*\n    \n" +
      "*Name:* " + value("name") + "\n" +
      "*Email:* " + value("email") + "\n" +
      "*Phone:* " + (value("phone") || "Not provided") + "\n" +
      "*Subject:* " + value("subject") + "\n\n" +
      "*Message:*\n" + value("message");

    const url =
      "https://api.whatsapp.com/send/?phone=" + this.dataset.phone +
      "&text=" + encodeURIComponent(message) +
      "&type=phone_number&app_absent=0";

    this.submit.disabled = true;
    this.submit.textContent = this.submit.dataset.busyLabel;

    window.setTimeout(() => {
      window.open(url, "_blank");
      this.form.reset();
      this.submit.disabled = false;
      this.submit.textContent = this.submit.dataset.idleLabel;
    }, 800);
  }
}

customElements.define("whatsapp-contact-form", WhatsappContactForm);

class ProductAccordion extends HTMLElement {
  connectedCallback() {
    this.querySelectorAll("[data-accordion-item]").forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const panel = item.querySelector("[data-accordion-panel]");
      const chevron = item.querySelector("[data-accordion-chevron]");
      const icon = item.querySelector("[data-accordion-icon]");
      if (!trigger || !panel) return;
      trigger.addEventListener("click", () => {
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        trigger.setAttribute("aria-expanded", String(willOpen));
        if (chevron) chevron.classList.toggle("rotate-180", willOpen);
        if (icon) {
          icon.classList.toggle("bg-primary", willOpen);
          icon.classList.toggle("text-white", willOpen);
          icon.classList.toggle("bg-primary/5", !willOpen);
        }
      });
    });
  }
}

customElements.define("product-accordion", ProductAccordion);

class ProductDetail extends HTMLElement {
  connectedCallback() {
    this.mainImage = this.querySelector("[data-main-image]");
    this.thumbnails = Array.from(this.querySelectorAll("[data-thumbnail]"));
    this.optionButtons = Array.from(this.querySelectorAll("[data-option-value]"));
    this.variantInput = this.querySelector("[data-variant-id-input]");
    this.priceEl = this.querySelector("[data-price]");
    this.compareWrap = this.querySelector("[data-compare-wrap]");
    this.comparePrice = this.querySelector("[data-compare-price]");
    this.discountPct = this.querySelector("[data-discount-pct]");
    this.ctaLabel = this.querySelector("[data-cta-label]");
    this.addToCart = this.querySelector("[data-add-to-cart]");

    const dataEl = this.querySelector("[data-variant-data]");
    try {
      this.variants = dataEl ? JSON.parse(dataEl.textContent) : [];
    } catch (error) {
      this.variants = [];
    }

    this.selectedOptions = this.optionButtons
      .filter((button) => button.getAttribute("aria-pressed") === "true")
      .reduce((acc, button) => {
        acc[Number(button.dataset.optionPosition) - 1] = button.dataset.value;
        return acc;
      }, []);

    this.initGallery();
    this.initOptions();
    this.initQuantity();
    this.initWhatsApp();
  }

  initGallery() {
    this.thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        if (this.mainImage) {
          this.mainImage.src = thumb.dataset.full;
          this.mainImage.alt = thumb.dataset.alt;
        }
        this.thumbnails.forEach((other) => {
          const isActive = other === thumb;
          other.classList.toggle("border-[#5a8739]", isActive);
          other.classList.toggle("shadow-md", isActive);
          other.classList.toggle("border-border", !isActive);
          other.classList.toggle("hover:border-[#5a8739]/40", !isActive);
        });
      });
    });
  }

  initOptions() {
    this.optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const position = Number(button.dataset.optionPosition) - 1;
        this.selectedOptions[position] = button.dataset.value;

        this.optionButtons.forEach((other) => {
          if (Number(other.dataset.optionPosition) - 1 !== position) return;
          const isActive = other === button;
          other.classList.toggle("border-[#5a8739]", isActive);
          other.classList.toggle("bg-[#5a8739]/10", isActive);
          other.classList.toggle("text-[#5a8739]", isActive);
          other.classList.toggle("shadow-sm", isActive);
          other.classList.toggle("border-border", !isActive);
          other.classList.toggle("hover:border-[#5a8739]/40", !isActive);
          other.classList.toggle("hover:bg-sage-light/20", !isActive);
          other.setAttribute("aria-pressed", String(isActive));
        });

        this.applyVariant();
      });
    });
  }

  applyVariant() {
    const match = this.variants.find((variant) =>
      variant.options.every((value, index) => value === this.selectedOptions[index])
    );
    if (!match) return;

    if (this.variantInput) this.variantInput.value = match.id;
    if (this.priceEl) this.priceEl.textContent = "₹" + match.price;

    if (this.compareWrap) {
      const showCompare = match.discountPct > 0 && match.compareAtPrice;
      this.compareWrap.hidden = !showCompare;
      if (showCompare) {
        if (this.comparePrice) this.comparePrice.textContent = "₹" + match.compareAtPrice;
        if (this.discountPct) this.discountPct.textContent = match.discountPct + "% OFF";
      }
    }

    if (this.addToCart) this.addToCart.disabled = !match.available;
    if (this.ctaLabel) this.ctaLabel.textContent = match.available ? "Add to Cart" : "Out of Stock";
  }

  // Desktop input and the mobile sticky bar's display stay in step.
  initQuantity() {
    this.qtyInput = this.querySelector("[data-qty-input]");
    this.qtyDisplay = this.querySelector("[data-qty-display]");
    if (!this.qtyInput) return;

    const setQty = (next) => {
      const value = Math.max(1, next);
      this.qtyInput.value = String(value);
      if (this.qtyDisplay) this.qtyDisplay.textContent = String(value);
    };

    this.querySelectorAll("[data-qty-decrease]").forEach((button) => {
      button.addEventListener("click", () => setQty(Number(this.qtyInput.value) - 1));
    });
    this.querySelectorAll("[data-qty-increase]").forEach((button) => {
      button.addEventListener("click", () => setQty(Number(this.qtyInput.value) + 1));
    });
    this.qtyInput.addEventListener("change", () => setQty(Number(this.qtyInput.value) || 1));
  }

  initWhatsApp() {
    this.querySelectorAll("[data-whatsapp-order]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const price = this.priceEl ? this.priceEl.textContent.trim() : "";
        const message =
          "Hi! I want to order: " + link.dataset.productTitle +
          (price ? " (" + price + ")" : "") +
          ". Please share availability and delivery details.";
        window.open(
          "https://api.whatsapp.com/send/?phone=" + link.dataset.phone +
            "&text=" + encodeURIComponent(message) +
            "&type=phone_number&app_absent=0",
          "_blank"
        );
      });
    });
  }
}

customElements.define("product-detail", ProductDetail);

// Mirrors the ?category= filtering in src/pages/Collections.tsx. Terms are
// separated by "OR"; a leading "-" marks an exclude term.
class CollectionsFilter extends HTMLElement {
  connectedCallback() {
    this.buttons = Array.from(this.querySelectorAll("[data-category-button]"));
    this.items = Array.from(this.querySelectorAll("[data-product-item]"));
    this.grid = this.querySelector("[data-product-grid]");
    this.emptyState = this.querySelector("[data-empty-state]");
    this.countEl = this.querySelector("[data-result-count]");
    this.banner = this.querySelector("[data-category-banner]");
    this.titleEl = this.querySelector("[data-category-title]");
    this.eyebrowEl = this.querySelector("[data-category-eyebrow]");

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => this.select(button.dataset.categoryId, true));
    });

    const viewAll = this.querySelector("[data-view-all]");
    if (viewAll) viewAll.addEventListener("click", () => this.select("all", true));

    window.addEventListener("popstate", () => this.select(this.categoryFromUrl(), false));
    this.select(this.categoryFromUrl(), false);
  }

  categoryFromUrl() {
    return new URLSearchParams(window.location.search).get("category") || "all";
  }

  select(categoryId, pushUrl) {
    const button =
      this.buttons.find((b) => b.dataset.categoryId === categoryId) ||
      this.buttons.find((b) => b.dataset.categoryId === "all");
    if (!button) return;
    const active = button.dataset.categoryId;

    if (pushUrl) {
      const url = new URL(window.location.href);
      if (active === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", active);
      window.history.pushState({}, "", url);
    }

    this.buttons.forEach((other) => {
      const isActive = other === button;
      other.classList.toggle("bg-[#5a8739]", isActive);
      other.classList.toggle("text-white", isActive);
      other.classList.toggle("border", !isActive);
      other.classList.toggle("border-input", !isActive);
      other.classList.toggle("bg-background", !isActive);
      other.classList.toggle("border-border", !isActive);
      other.classList.toggle("hover:bg-sage-light", !isActive);
      other.setAttribute("aria-pressed", String(isActive));
    });

    if (this.titleEl) this.titleEl.textContent = button.dataset.label;
    if (this.eyebrowEl) this.eyebrowEl.textContent = button.dataset.eyebrow;
    if (this.banner) {
      this.banner.src =
        active === "microgreens" ? this.banner.dataset.bannerMicrogreens : this.banner.dataset.bannerDefault;
      this.banner.alt = active === "microgreens" ? "Farm Fresh Produce" : "Aurora Collection";
    }

    const query = (button.dataset.query || "").trim();
    let visible = 0;

    this.items.forEach((item) => {
      const matches = this.matches(item.dataset.haystack || "", query);
      item.hidden = !matches;
      if (matches) visible++;
    });

    if (this.countEl) {
      this.countEl.textContent = "Showing " + visible + " product" + (visible === 1 ? "" : "s");
      this.countEl.hidden = visible === 0;
    }
    if (this.grid) this.grid.hidden = visible === 0;
    if (this.emptyState) this.emptyState.hidden = visible !== 0;
  }

  matches(haystack, query) {
    if (!query) return true;
    const terms = query.split(/\s+OR\s+/i).map((t) => t.trim().toLowerCase()).filter(Boolean);
    const include = terms.filter((t) => !t.startsWith("-"));
    const exclude = terms.filter((t) => t.startsWith("-")).map((t) => t.slice(1));
    const matchesInclude = include.length === 0 || include.some((t) => haystack.includes(t));
    const matchesExclude = exclude.some((t) => haystack.includes(t));
    return matchesInclude && !matchesExclude;
  }
}

customElements.define("collections-filter", CollectionsFilter);

// Slide-in cart drawer, mirroring src/components/CartDrawer.tsx. State comes
// from Shopify's Ajax Cart API instead of the React store; thresholds, copy and
// the Aarambh add-on rules are unchanged.
class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.threshold = Number(this.dataset.freeShippingThreshold) || 999;
    this.flatFee = Number(this.dataset.flatShippingFee) || 60;
    this.aarambhHandle = this.dataset.aarambhHandle || "";
    this.aarambhVariantId = String(this.dataset.aarambhVariantId || "");
    this.panelOpenClass = splitClasses(this.dataset.panelOpenClass);
    this.panelClosedClass = splitClasses(this.dataset.panelClosedClass);
    this.disabledClass = splitClasses(this.dataset.disabledClass);

    this.backdrop = this.querySelector("[data-cart-backdrop]");
    this.panel = this.querySelector("[data-cart-panel]");
    this.itemsEl = this.querySelector("[data-cart-items]");
    this.itemTemplate = this.querySelector("[data-cart-item-template]");
    this.bodyEl = this.querySelector("[data-cart-body]");
    this.emptyEl = this.querySelector("[data-cart-empty]");
    this.footerEl = this.querySelector("[data-cart-footer]");
    this.countEl = this.querySelector("[data-cart-count]");
    this.suggestions = Array.from(this.querySelectorAll("[data-suggestion]"));

    this.backdrop.addEventListener("click", () => this.close());
    this.querySelector("[data-cart-close]").addEventListener("click", () => this.close());
    this.onKeydown = (e) => { if (e.key === "Escape") this.close(); };

    const checkout = this.querySelector("[data-cart-checkout]");
    if (checkout) {
      checkout.addEventListener("click", () => {
        if (checkout.disabled) return;
        window.location.href = "/checkout";
      });
    }

    // "+ Add" on the order-bump and every suggestion row
    this.querySelectorAll("[data-add-variant]").forEach((button) => {
      button.addEventListener("click", () => this.addVariant(button.dataset.addVariant, 1));
    });

    document.addEventListener("cart-drawer:open", () => this.open());
    document.addEventListener("cart-drawer:refresh", () => this.refresh());

    this.refresh();
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.onKeydown);
  }

  open() {
    this.backdrop.hidden = false;
    swapClasses(this.panel, this.panelClosedClass, this.panelOpenClass);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.onKeydown);
    this.refresh();
  }

  close() {
    this.backdrop.hidden = true;
    swapClasses(this.panel, this.panelOpenClass, this.panelClosedClass);
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.onKeydown);
  }

  async request(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Cart request failed: " + response.status);
    return response.json();
  }

  async addVariant(variantId, quantity) {
    try {
      await this.request("/cart/add.js", { items: [{ id: Number(variantId), quantity: quantity || 1 }] });
    } catch (error) {
      return;
    }
    await this.refresh();
    this.open();
  }

  async changeLine(line, quantity) {
    try {
      await this.request("/cart/change.js", { line: line, quantity: quantity });
    } catch (error) {
      return;
    }
    await this.refresh();
  }

  async refresh() {
    let cart;
    try {
      const response = await fetch("/cart.js", { headers: { Accept: "application/json" } });
      cart = await response.json();
    } catch (error) {
      return;
    }
    this.cart = cart;
    this.render(cart);
    this.syncHeaderBadge(cart.item_count);
  }

  syncHeaderBadge(count) {
    document.querySelectorAll("[data-cart-count-badge]").forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
    });
  }

  render(cart) {
    const items = cart.items || [];
    const isAarambh = (item) =>
      String(item.variant_id) === this.aarambhVariantId || item.handle === this.aarambhHandle;

    const hasAarambh = items.some(isAarambh);
    const hasOnlyAarambh = items.length > 0 && items.every(isAarambh);
    const hasQualifyingItem = items.some((item) => !isAarambh(item));

    // cart.items_subtotal_price is in cents
    const subtotal = (cart.items_subtotal_price || 0) / 100;
    const isFreeShipping = subtotal >= this.threshold;
    const amountAway = Math.max(0, this.threshold - subtotal);
    const shippingFee = isFreeShipping ? 0 : this.flatFee;
    const estimatedTotal = subtotal + shippingFee;
    const progressPercent = Math.min(100, Math.round((subtotal / this.threshold) * 100));

    const totalItems = cart.item_count || 0;
    this.countEl.hidden = totalItems === 0;
    this.countEl.textContent = totalItems + " item" + (totalItems === 1 ? "" : "s");

    this.emptyEl.hidden = items.length > 0;
    this.bodyEl.hidden = items.length === 0;
    this.footerEl.hidden = items.length === 0;

    // shipping nudge
    const nudge = this.querySelector("[data-shipping-nudge]");
    nudge.hidden = items.length === 0;
    this.querySelector("[data-nudge-unlocked]").hidden = !isFreeShipping;
    const progress = this.querySelector("[data-nudge-progress]");
    progress.hidden = isFreeShipping;
    if (!isFreeShipping) {
      this.querySelector("[data-amount-away]").textContent = "₹" + Math.ceil(amountAway);
      this.querySelector("[data-progress-label]").textContent = progressPercent + "%";
      this.querySelector("[data-progress-bar]").style.width = progressPercent + "%";
    }

    this.querySelector("[data-aarambh-notice]").hidden = !hasOnlyAarambh;

    const bump = this.querySelector("[data-aarambh-bump]");
    if (bump) bump.hidden = !(hasQualifyingItem && !hasAarambh);

    this.renderItems(items);
    this.renderSuggestions(items, { hasOnlyAarambh, isFreeShipping, amountAway });

    // footer totals
    this.querySelector("[data-subtotal]").textContent = "₹" + Math.round(subtotal);
    this.querySelector("[data-shipping-free]").hidden = !isFreeShipping;
    this.querySelector("[data-shipping-paid]").hidden = isFreeShipping;
    this.querySelector("[data-estimated-total]").textContent = "₹" + Math.round(estimatedTotal);

    const checkout = this.querySelector("[data-cart-checkout]");
    const label = this.querySelector("[data-checkout-label]");
    checkout.disabled = hasOnlyAarambh || items.length === 0;
    this.disabledClass.forEach((cls) => checkout.classList.toggle(cls, checkout.disabled));
    checkout.style.background = hasOnlyAarambh ? "#8a9284" : "linear-gradient(135deg, #2e4e18, #4f7a2e)";
    label.textContent = hasOnlyAarambh
      ? "Add a pack or combo to checkout"
      : "Checkout • ₹" + Math.round(estimatedTotal);
  }

  renderItems(items) {
    const nodes = items.map((item, index) => {
      const fragment = this.itemTemplate.content.cloneNode(true);
      const line = index + 1;

      const image = fragment.querySelector("[data-item-image]");
      const fallback = fragment.querySelector("[data-item-image-fallback]");
      if (item.image) {
        image.src = item.image;
        image.alt = item.product_title;
        image.hidden = false;
        fallback.hidden = true;
      }

      fragment.querySelector("[data-item-title]").textContent = item.product_title;

      const variantEl = fragment.querySelector("[data-item-variant]");
      if (item.variant_title && item.variant_title !== "Default Title") {
        variantEl.textContent = item.variant_title;
        variantEl.hidden = false;
      }

      fragment.querySelector("[data-item-price]").textContent = "₹" + Math.round(item.price / 100);
      fragment.querySelector("[data-item-quantity]").textContent = item.quantity;

      fragment.querySelector("[data-item-remove]").addEventListener("click", () => this.changeLine(line, 0));
      fragment.querySelector("[data-item-decrease]").addEventListener("click", () => this.changeLine(line, item.quantity - 1));
      fragment.querySelector("[data-item-increase]").addEventListener("click", () => this.changeLine(line, item.quantity + 1));

      return fragment;
    });
    this.itemsEl.replaceChildren.apply(this.itemsEl, nodes);
  }

  renderSuggestions(items, state) {
    const inCart = new Set(items.map((item) => String(item.variant_id)));
    let shown = 0;
    this.suggestions.forEach((row) => {
      let eligible = !inCart.has(row.dataset.variantId) && shown < 3;
      // When Aarambh is the only item, only a full-sized pack or combo unblocks checkout.
      if (eligible && state.hasOnlyAarambh && row.dataset.combo !== "true") eligible = false;
      row.hidden = !eligible;
      if (eligible) shown++;
    });

    const wrapper = this.querySelector("[data-suggestions]");
    wrapper.hidden = shown === 0 || items.length === 0;

    const title = this.querySelector("[data-suggestions-title]");
    title.textContent = state.hasOnlyAarambh
      ? "Add a Pack or Combo to Proceed"
      : state.isFreeShipping
        ? "You might also like"
        : "Add to reach Free Shipping";

    const remaining = this.querySelector("[data-suggestions-remaining]");
    const showRemaining = !state.isFreeShipping && !state.hasOnlyAarambh;
    remaining.hidden = !showRemaining;
    if (showRemaining) remaining.textContent = "₹" + Math.ceil(state.amountAway) + " to go";
  }
}

customElements.define("cart-drawer", CartDrawer);

// Any element with data-cart-open (the header icon) opens the drawer.
document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-cart-open]");
  if (opener) {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent("cart-drawer:open"));
  }
});

// Product cards and the product form add through the Ajax API and open the drawer.
document.addEventListener("click", async (event) => {
  const trigger = event.target.closest("[data-ajax-add]");
  if (!trigger || trigger.disabled) return;
  event.preventDefault();
  event.stopPropagation();

  const form = trigger.closest("form");
  const variantId = form
    ? (form.querySelector("[name='id']") || {}).value
    : trigger.dataset.variantId;
  if (!variantId) return;

  const quantityInput = form ? form.querySelector("[name='quantity']") : null;
  const quantity = quantityInput ? Number(quantityInput.value) || 1 : 1;

  const drawer = document.querySelector("cart-drawer");
  if (drawer) await drawer.addVariant(variantId, quantity);
});
