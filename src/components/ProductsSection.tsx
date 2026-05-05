import { Link } from "react-router-dom";
import { ShopifyProductsGrid } from "@/components/ShopifyProductsGrid";

const ProductsSection = () => (
  <section id="products" className="py-14 md:py-20 px-4 bg-[#fffbf5] relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#f9f6f0] to-transparent" />

    <div className="max-w-7xl mx-auto relative z-10">
      {/* Header — left-aligned like the wireframe */}
      <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4f7a2e] mb-2.5 flex items-center gap-2">
            <span className="w-6 h-px bg-[#4f7a2e]/40" />
            Aurora Collection
          </p>
          <h2
            className="text-4xl md:text-5xl text-[#2a3625] leading-tight tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            What would you like today?
          </h2>
        </div>

        <Link
          to="/collections"
          className="w-fit px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
        >
          Explore Products →
        </Link>
      </div>

      <ShopifyProductsGrid limit={6} />

      {/* Trust strip */}
      <div className="mt-12 flex flex-wrap justify-center gap-10 py-7 border-t border-[#2e3f25]/5">
        {["Chemical-Free Formulas", "Ethically Farm-Sourced", "Ancient Vedic Methods", "Modern Lab Tested"].map(
          (point) => (
            <div key={point} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#4f7a2e]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5c6e58]/60">
                {point}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  </section>
);

export default ProductsSection;
