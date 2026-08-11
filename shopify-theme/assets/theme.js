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
    if (!this.header) return;
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
