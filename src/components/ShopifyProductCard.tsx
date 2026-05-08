import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const productBadges: Record<string, string> = {
  "incense cup": "Best Seller",
  "incense stick": "Everyday",
  "ghee lamp": "Sacred",
  "combo": "Best Value",
};

function getBadge(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [key, val] of Object.entries(productBadges)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressData, setAddressData] = useState({ name: "", phone: "", address: "" });

  const selectedVariant = node.variants.edges[selectedVariantIndex]?.node;
  const firstImage = node.images.edges[0]?.node;

  const currentPrice = parseFloat(selectedVariant?.price.amount || "0");
  const originalPrice = selectedVariant?.compareAtPrice?.amount
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : 0;
  const hasDiscount = originalPrice > currentPrice;
  const discountPct = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const isMicrogreens =
    node.title.toLowerCase().includes("microgreen") ||
    node.title.toLowerCase().includes("leafy") ||
    node.description.toLowerCase().includes("microgreen");

  const badge = getBadge(node.title);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart");
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddressDialog(true);
  };

  const submitWhatsAppOrder = () => {
    if (!addressData.name || !addressData.phone || !addressData.address) {
      toast.error("Please fill in all fields");
      return;
    }
    const message = `Hi! I want to order:\n\nProduct: ${node.title}\nPrice: ₹${Math.round(currentPrice)}\n\nDelivery Details:\nName: ${addressData.name}\nPhone: ${addressData.phone}\nAddress: ${addressData.address}\n\nProduct Link: https://stomatalfarms.com/products/${node.handle}`;
    window.open(`https://api.whatsapp.com/send/?phone=919790768502&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, "_blank");
    setShowAddressDialog(false);
    setAddressData({ name: "", phone: "", address: "" });
    toast.success("Opening WhatsApp...");
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block h-full">
      <div
        className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border"
        style={{ background: "#fffbf5", borderColor: "rgba(46,63,37,0.10)" }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#f7f1e8]">
          {/* Badge */}
          {badge && (
            <span
              className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-md"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              {badge}
            </span>
          )}
          {hasDiscount && discountPct > 0 && (
            <span
              className="absolute top-3 right-3 z-10 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md"
              style={{ background: "#b56c3d" }}
            >
              {discountPct}% OFF
            </span>
          )}

          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6a7462] text-xs">No image</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3
              className="text-xl md:text-2xl font-semibold text-[#1e2519] leading-tight group-hover:text-[#4f7a2e] transition-colors mb-1.5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {node.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-2.5 h-2.5 text-[#b56c3d] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-[#6a7462] font-bold">5.0</span>
            </div>

            {/* Features list */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
              {["Natural", "Lab Tested", "Chemical Free"].map((f) => (
                <span key={f} className="text-[9px] text-[#4f7a2e] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#4f7a2e]/40" />
                  {f}
                </span>
              ))}
            </div>

            {/* Variant selector */}
            {node.variants.edges.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {node.variants.edges.map((edge, idx) => (
                  <button
                    key={edge.node.id}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariantIndex(idx); }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all border"
                    style={
                      selectedVariantIndex === idx
                        ? { background: "#4f7a2e", color: "#fff", borderColor: "#4f7a2e" }
                        : { background: "transparent", color: "#6a7462", borderColor: "rgba(46,63,37,0.20)" }
                    }
                  >
                    {edge.node.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col gap-2.5 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#1e2519]">₹{Math.round(currentPrice)}</span>
              {hasDiscount && originalPrice > 0 && (
                <span className="text-xs text-[#6a7462] line-through">₹{Math.round(originalPrice)}</span>
              )}
            </div>

            <button
              onClick={isMicrogreens ? handleWhatsAppOrder : handleAddToCart}
              className="w-full py-2.5 rounded-full text-[13px] font-black text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              {isMicrogreens ? "Order on WhatsApp" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp address dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Please provide your delivery information to complete your order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(["name", "phone", "address"] as const).map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-[#1e2519] mb-1.5 block capitalize">{field === "phone" ? "Phone Number" : field === "address" ? "Delivery Address" : "Full Name"} *</label>
                {field === "address" ? (
                  <Textarea
                    name={field}
                    value={addressData[field]}
                    onChange={(e) => setAddressData({ ...addressData, [field]: e.target.value })}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    className="w-full resize-none"
                  />
                ) : (
                  <Input
                    name={field}
                    type={field === "phone" ? "tel" : "text"}
                    value={addressData[field]}
                    onChange={(e) => setAddressData({ ...addressData, [field]: e.target.value })}
                    placeholder={field === "phone" ? "+91 XXXXX XXXXX" : `Enter your ${field}`}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAddressDialog(false); }}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold border border-[rgba(46,63,37,0.20)] text-[#1e2519] hover:bg-[rgba(46,63,37,0.04)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); submitWhatsAppOrder(); }}
              className="flex-1 py-2.5 rounded-full text-sm font-black text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Send Order
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Link>
  );
};
