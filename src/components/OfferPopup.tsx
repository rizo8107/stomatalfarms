import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const OFFER_HANDLE = "aurora-dasangam-duo-free-aarambh-starter-set-monsoon-offer";
const DISMISSED_KEY = "aurora_offer_popup_seen";
const OPEN_DELAY_MS = 3000;

/** Radix holds a pointer-events lock on <body> while a modal is mounted. Let the
 *  popup finish its exit animation before the cart drawer opens on top of it. */
const EXIT_ANIMATION_MS = 200;

const wasDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false; // private mode / storage disabled — show the popup rather than crash
  }
};

const markDismissed = () => {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    /* storage unavailable — popup simply reappears next load */
  }
};

/** key_highlights is a multiline metafield; blank lines separate the points. */
const parseHighlights = (raw?: string | null): string[] =>
  (raw || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

const OfferPopup = () => {
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [open, setOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (wasDismissed()) return;

    const timer = setTimeout(() => {
      fetchProductByHandle(OFFER_HANDLE)
        .then((node) => {
          if (!node || !node.variants?.edges?.length) return;
          setProduct(node);
          setOpen(true);
        })
        .catch((err) => {
          // Shopify unreachable — the home page must not break over a promo popup.
          console.error("Offer popup failed to load product:", err);
        });
    }, OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) markDismissed();
  };

  if (!product) return null;

  const variant = product.variants.edges[0]?.node;
  if (!variant) return null;

  const image = product.images.edges[0]?.node;
  const highlights = parseHighlights(product.key_highlights?.value);
  const price = parseFloat(variant.price.amount || "0");
  const compareAt = parseFloat(variant.compareAtPrice?.amount || "0");
  const hasDiscount = compareAt > price;
  const saving = hasDiscount ? Math.round(compareAt - price) : 0;
  const percentOff = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const inStock = variant.availableForSale;

  const handleAddToCart = () => {
    handleOpenChange(false);
    setTimeout(() => {
      addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast.success("Added to cart");
    }, EXIT_ANIMATION_MS);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-2xl border-[#f5c842]/25 p-0 shadow-2xl shadow-black/50 sm:rounded-2xl [&>button]:right-2.5 [&>button]:top-2.5 [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-90 [&>button]:backdrop-blur-sm [&>button]:transition-opacity [&>button]:hover:opacity-100"
        style={{ background: "linear-gradient(135deg, #1c1408, #2a1e08)" }}
      >
        <DialogDescription className="sr-only">
          Limited-time monsoon offer on {product.title}
        </DialogDescription>

        {/* Image */}
        {image && (
          <div className="relative">
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="block h-48 w-full object-cover sm:h-52"
              width={1024}
              height={1024}
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1c1408] to-transparent" />
            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-full bg-[#f5c842] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#1a1000]">
                {percentOff}% Off
              </span>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <span className="w-fit rounded-full border border-[#f5c842]/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#f5c842]">
            Monsoon Offer
          </span>

          <DialogTitle
            className="text-[22px] leading-[1.1] text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            {product.title}
          </DialogTitle>

          {highlights.length > 0 && (
            <ul className="space-y-1">
              {highlights.map((point) => (
                <li key={point} className="flex items-start gap-1.5 text-[11px] leading-snug text-white/60">
                  <span className="mt-0.5 flex-shrink-0 text-[#f5c842]">›</span>
                  {point}
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-[28px] font-light leading-none text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ₹{Math.round(price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-white/30 line-through">₹{Math.round(compareAt)}</span>
                <span className="rounded bg-[#f5c842] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1a1000]">
                  Save ₹{saving}
                </span>
              </>
            )}
          </div>

          {/* CTA */}
          {inStock ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1000] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f5c842]/20"
                style={{ background: "#f5c842" }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <Link
                to={`/product/${product.handle}`}
                onClick={() => handleOpenChange(false)}
                className="flex items-center rounded-full border border-white/15 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-white/60 transition-all hover:border-white/30 hover:text-white"
              >
                Details
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to={`/product/${product.handle}`}
                onClick={() => handleOpenChange(false)}
                className="flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1000] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f5c842]/20"
                style={{ background: "#f5c842" }}
              >
                View Offer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[11px] text-white/40">Back in stock soon</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferPopup;
