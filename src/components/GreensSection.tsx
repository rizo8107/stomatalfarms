import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const categories = [
  {
    title: "Greens",
    desc: "Hydroponically grown, chemical-free seasonal greens",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7cc0e5_f91c9dad181c449e989d6a3c6ace055d_mv2_4b260971-6fcc-4440-b5ab-a981700befde.jpg?v=1757855391",
  },
  {
    title: "Microgreens",
    desc: "Nutrient-dense, delivered weekly to your door",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7cc0e5_e3229c8e871b4bd8b19f594f1d29a4dd_mv2_7ded16d3-31b2-4285-bcf0-2c9f2f87cbc6.jpg?v=1757855508",
  },
  {
    title: "Dehydrated Blends",
    desc: "Naturally dehydrated Moringa & Curry Leaf",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/01.jpg?v=1773151907",
  },
];

const isGreenProduct = (p: ShopifyProduct) => {
  const title = p.node.title.toLowerCase();
  const desc = p.node.description.toLowerCase();
  return (
    title.includes("microgreen") ||
    title.includes("greens") ||
    title.includes("moringa") ||
    title.includes("leafy") ||
    title.includes("curry leaf") ||
    title.includes("dehydrated") ||
    desc.includes("microgreen") ||
    desc.includes("hydroponically")
  );
};

const isAvailable = (p: ShopifyProduct) =>
  p.node.variants.edges.some((e) => e.node.availableForSale);

const GreensSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchProducts(50).then((all) => {
      const greens = all.filter((p) => isGreenProduct(p) && isAvailable(p));
      setProducts(greens);
      setLoading(false);
    });
  }, []);

  const handleWhatsApp = (p: ShopifyProduct) => {
    const price = p.node.variants.edges[0]?.node.price.amount;
    const msg = `Hi! I want to order: ${p.node.title}${price ? ` (₹${Math.round(parseFloat(price))})` : ""}. Please share availability and delivery details.`;
    window.open(
      `https://api.whatsapp.com/send/?phone=919790768502&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`,
      "_blank"
    );
  };

  const handleAddToCart = (p: ShopifyProduct) => {
    const variant = p.node.variants.edges[0]?.node;
    if (!variant) return;
    addItem({ product: p, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions || [] });
    toast.success("Added to cart");
  };

  const isMicrogreens = (p: ShopifyProduct) => {
    const t = p.node.title.toLowerCase();
    const d = p.node.description.toLowerCase();
    return t.includes("microgreen") || t.includes("leafy") || d.includes("microgreen");
  };

  return (
    <section className="py-16 md:py-28 px-4 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #1a2e12 0%, #2a3f1a 40%, #1e3614 100%)" }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #a8c690 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7aaa55 0%, transparent 40%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top: headline + category cards */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start mb-20">

          {/* Left */}
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a8c690] flex items-center gap-2">
              <span className="w-6 h-px bg-[#a8c690]/40" />
              By Stomatal Farms
            </p>
            <h2
              className="leading-tight text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 500 }}
            >
              <span className="italic text-[#a8c690]">Greens,</span> Microgreens<br />
              &amp; Dehydrated <span className="italic text-[#a8c690]">Blends</span>
            </h2>
            <p className="text-white/60 font-light text-base leading-relaxed max-w-sm">
              Freshly harvested and delivered straight from our farm to your kitchen.
            </p>
            <Link
              to="/collections?category=greens"
              className="group inline-flex items-center gap-2.5 w-fit px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] text-[#1a2e12] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#a8c690" }}
            >
              Shop Farm Produce
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right — category cards */}
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="rounded-2xl border border-white/10 p-3 md:p-4 flex gap-4 items-center"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base text-white leading-snug font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed mt-0.5">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a8c690] mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-[#a8c690]/40" />
                Fresh · Weekly Harvest
              </p>
              <h3 className="text-2xl md:text-3xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                Our Green Products
              </h3>
            </div>
            <Link
              to="/collections?category=greens"
              className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-[#a8c690] border border-[#a8c690]/30 px-5 py-2 rounded-full hover:bg-white/5 transition-colors"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#a8c690]" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-white/40 text-center py-12 text-sm">No green products available right now.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {products.map((p) => {
                const firstImage = p.node.images.edges[0]?.node;
                const variant = p.node.variants.edges[0]?.node;
                const price = variant ? Math.round(parseFloat(variant.price.amount)) : null;
                const compareAt = variant?.compareAtPrice ? Math.round(parseFloat(variant.compareAtPrice.amount)) : null;
                const isWA = isMicrogreens(p);

                return (
                  <div
                    key={p.node.id}
                    className="rounded-xl md:rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    {/* Image — shorter on mobile */}
                    {firstImage ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={firstImage.url}
                          alt={firstImage.altText || p.node.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-white/5 flex items-center justify-center text-3xl">🌱</div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col flex-1 p-3 md:p-5 gap-2">
                      <h4
                        className="text-sm md:text-base text-white leading-snug line-clamp-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                      >
                        {p.node.title}
                      </h4>

                      {/* Price row */}
                      <div className="flex items-baseline gap-1.5 mt-auto">
                        {price && <span className="text-sm md:text-lg font-bold text-[#a8c690]">₹{price}</span>}
                        {compareAt && compareAt > (price ?? 0) && (
                          <span className="text-[10px] text-white/30 line-through">₹{compareAt}</span>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => isWA ? handleWhatsApp(p) : handleAddToCart(p)}
                        className="w-full py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.12em] text-[#1a2e12] transition-all hover:opacity-90"
                        style={{ background: "#a8c690" }}
                      >
                        {isWA ? "WhatsApp" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GreensSection;
