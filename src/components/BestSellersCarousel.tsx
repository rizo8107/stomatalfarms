import { useEffect, useState, useCallback } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export const BestSellersCarousel = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const autoplay = Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetchProducts(8)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 md:py-20 px-4 bg-[#fffbf5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4f7a2e] mb-2 flex items-center gap-2">
              <span className="w-6 h-px bg-[#4f7a2e]/40" />
              Best Sellers
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2a3625] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              Our most loved products.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-9 h-9 rounded-full border border-[#2a3625]/10 bg-white flex items-center justify-center text-[#2a3625] hover:bg-[#2a3625] hover:text-white transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="w-9 h-9 rounded-full border border-[#2a3625]/10 bg-white flex items-center justify-center text-[#2a3625] hover:bg-[#2a3625] hover:text-white transition-all duration-300 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#4f7a2e]" />
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 md:gap-4">
              {products.map((product) => (
                <div
                  key={product.node.id}
                  className="flex-[0_0_72%] sm:flex-[0_0_46%] md:flex-[0_0_30%] lg:flex-[0_0_23%] min-w-0"
                >
                  <ShopifyProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[#6a7462]/50 mt-5 md:hidden">Swipe to see more</p>
      </div>
    </section>
  );
};
