import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";

const BUNDLE_IDS = [
  "gid://shopify/Product/8792608112797",
  "gid://shopify/Product/8711416709277",
  "gid://shopify/Product/8711408386205",
  "gid://shopify/Product/8711399866525",
];

const NODES_QUERY = `
  query GetNodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        description
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        images(first: 3) { edges { node { url altText } } }
        variants(first: 5) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            }
          }
        }
        options { name values }
      }
    }
  }
`;

async function fetchBundleProducts(): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(NODES_QUERY, { ids: BUNDLE_IDS });
  if (!data) return [];
  return (data.data.nodes as ShopifyProduct["node"][])
    .filter(Boolean)
    .map((node) => ({ node }));
}

const BULLET_POINTS = [
  "100% natural cow dung base",
  "Hydrodistilled botanical essence",
  "No charcoal · No synthetics",
  "Burns ~45 min, aroma lingers for hours",
];

const BundleCard = ({ product, active }: { product: ShopifyProduct; active: boolean }) => {
  const { node } = product;
  const addItem = useCartStore((s) => s.addItem);
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const currentPrice = parseFloat(variant?.price.amount || "0");
  const originalPrice = parseFloat(variant?.compareAtPrice?.amount || "0");
  const hasDiscount = originalPrice > currentPrice;
  const saving = hasDiscount ? Math.round(originalPrice - currentPrice) : 0;

  const handleAddToCart = () => {
    if (!variant) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart");
  };

  return (
    <div className="w-full min-w-0">
      <div
        className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-500 border ${active ? "border-[#f5c842]/30 shadow-xl shadow-black/50" : "border-white/5"
          }`}
        style={{ background: "linear-gradient(135deg, #1c1408, #2a1e08)" }}
      >
        {/* TOP — info */}
        <div className="p-5 md:p-7 flex flex-col gap-4 min-w-0">
          {/* Badge */}
          <span className="w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-[#f5c842]/40 text-[#f5c842]">
            Most Popular
          </span>

          {/* Title */}
          <div>
            <h3
              className="text-xl md:text-2xl text-white leading-tight mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              {node.title}
            </h3>
            {/* Bullet points */}
            <ul className="space-y-1">
              {BULLET_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-1.5 text-[11px] text-white/55 leading-snug">
                  <span className="text-[#f5c842] mt-0.5 flex-shrink-0">›</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-2xl md:text-3xl font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ₹{Math.round(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-white/30 line-through">₹{Math.round(originalPrice)}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#f5c842] text-[#1a1000]">
                  Save ₹{saving}
                </span>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1000] transition-all hover:-translate-y-0.5"
              style={{ background: "#f5c842" }}
            >
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </button>
            <Link
              to={`/product/${node.handle}`}
              className="flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white/60 border border-white/15 transition-all hover:border-white/30 hover:text-white"
            >
              Details
            </Link>
          </div>
        </div>

        {/* BOTTOM — image */}
        <div className="w-full relative">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-auto block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
          )}
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#1c1408] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export const BundleCarousel = () => {
  const [bundles, setBundles] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    fetchBundleProducts()
      .then(setBundles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-[#0d0d08] flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#f5c842]" />
      </section>
    );
  }

  if (bundles.length === 0) return null;

  return (
    <section className="py-10 md:py-16 px-4 bg-[#0d0d08] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f5c842]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2
              className="text-3xl md:text-5xl text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              The <span className="italic text-[#f5c842]">Aurora Collection</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex">
            {bundles.map((product, i) => (
              <div key={product.node.id} className="pl-3 md:pl-4 flex-[0_0_88%] sm:flex-[0_0_72%] md:flex-[0_0_62%] lg:flex-[0_0_52%] min-w-0">
                <BundleCard product={product} active={activeIndex === i} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {bundles.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${activeIndex === i
                  ? "w-6 h-1.5 bg-[#f5c842]"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
