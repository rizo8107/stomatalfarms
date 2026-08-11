import { useEffect, useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Loader2, X, Truck, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts, fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING_FEE = 60;
const AARAMBH_HANDLE = "aarambh-the-starter-collection-incense-sticks-by-aurora-stomatal-farms";
const AARAMBH_VARIANT_ID = "gid://shopify/ProductVariant/48305831411869";

export const CartDrawer = () => {
  const {
    items,
    isLoading,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    createCheckout,
    addItem,
  } = useCartStore();

  const [suggestions, setSuggestions] = useState<ShopifyProduct[]>([]);
  const [aarambhProduct, setAarambhProduct] = useState<ShopifyProduct | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = isFreeShipping ? 0 : FLAT_SHIPPING_FEE;
  const estimatedTotal = subtotal + shippingFee;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const isAarambhItem = (item: typeof items[0]) =>
    item.variantId === AARAMBH_VARIANT_ID ||
    item.product.node.handle === AARAMBH_HANDLE;

  const hasAarambh = items.some(isAarambhItem);
  const hasOnlyAarambh = items.length > 0 && items.every(isAarambhItem);
  const hasQualifyingItem = items.some((item) => !isAarambhItem(item));

  // Fetch suggestions when cart opens (prioritize combos & best-sellers)
  useEffect(() => {
    if (!isCartOpen || items.length === 0) return;
    fetchProducts(12).then((all) => {
      const cartIds = new Set(items.map((i) => i.product.node.id));
      const nonCart = all.filter((p) => !cartIds.has(p.node.id) && p.node.handle !== AARAMBH_HANDLE);
      // Prioritize combos first, then other products
      const sorted = nonCart.sort((a, b) => {
        const aCombo = a.node.title.toLowerCase().includes("combo") ? -1 : 1;
        const bCombo = b.node.title.toLowerCase().includes("combo") ? -1 : 1;
        return aCombo - bCombo;
      });
      setSuggestions(sorted.slice(0, 3));
    });
  }, [isCartOpen, items.length]);

  // Fetch Aarambh product details when cart is open
  useEffect(() => {
    if (!isCartOpen) return;
    fetchProductByHandle(AARAMBH_HANDLE).then((prod) => {
      if (prod) {
        setAarambhProduct({ node: prod });
      }
    });
  }, [isCartOpen]);

  const handleCheckout = async () => {
    if (items.length === 0 || hasOnlyAarambh) return;
    try {
      const url = await createCheckout();
      if (url) {
        window.location.href = url;
        setCartOpen(false);
      }
    } catch (e) {
      console.error("Checkout failed:", e);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#fffbf5", borderLeft: "1px solid rgba(46,63,37,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2e3f25]/8">
          <div>
            <h2
              className="text-2xl text-[#2a3625]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              Your Cart
            </h2>
            {totalItems > 0 && (
              <p className="text-xs text-[#6a7462] mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 rounded-full border border-[#2e3f25]/10 flex items-center justify-center text-[#6a7462] hover:bg-[#2e3f25]/5 transition-colors"
            aria-label="Close Cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Nudge */}
        {items.length > 0 && (
          <div className="px-6 py-3.5 border-b border-[#2e3f25]/8 bg-[#fbf7ee]">
            {isFreeShipping ? (
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#2e4e18] bg-[#4f7a2e]/10 px-3.5 py-2.5 rounded-xl border border-[#4f7a2e]/20 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-[#4f7a2e] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>
                  🎉 You've unlocked <strong className="font-bold text-[#2e4e18]">FREE Shipping</strong>!
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#2a3625] font-medium flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#b56c3d]" />
                    You're <span className="font-bold text-[#b56c3d]">₹{Math.ceil(amountAway)}</span> away from <span className="font-bold text-[#4f7a2e]">Free Shipping</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#6a7462]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#2e3f25]/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #b56c3d 0%, #d4af37 60%, #4f7a2e 100%)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-[#6a7462] flex items-center justify-between">
                  <span>₹60 flat shipping below ₹999</span>
                  <span className="font-semibold text-[#4f7a2e]">Free shipping over ₹999</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Aarambh Standalone Notice (when Aarambh is the only item in cart) */}
        {hasOnlyAarambh && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-[#fff8ed] border border-[#d4af37]/35 flex items-start gap-2.5 text-xs text-[#7a5c00] animate-fade-in">
            <AlertCircle className="w-4 h-4 text-[#b58900] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#2a3625]">Aarambh is an Order Add-on</p>
              <p className="text-[11px] leading-relaxed text-[#6a7462]">
                The Aarambh Starter Set (₹99) rides alongside any full-sized pack or combo. Please add any full-sized product below to proceed to checkout!
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart className="w-12 h-12 text-[#2e3f25]/20" strokeWidth={1} />
              <p className="text-[#6a7462] font-light">Your cart is empty</p>
              <p className="text-xs text-[#6a7462]/60">Add some incense to begin your ritual</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const image = item.product.node.images?.edges?.[0]?.node;
                return (
                  <div
                    key={item.variantId}
                    className="flex gap-3 p-3 rounded-2xl border border-[#2e3f25]/8 bg-white"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0ece4] flex-shrink-0">
                      {image ? (
                        <img src={image.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🕯️</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm text-[#2a3625] leading-snug mb-0.5 line-clamp-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                      >
                        {item.product.node.title}
                      </h4>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-[#6a7462] mb-1">{item.variantTitle}</p>
                      )}
                      <p className="text-sm font-bold text-[#4f7a2e]">
                        ₹{Math.round(parseFloat(item.price.amount))}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[#6a7462]/50 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 border border-[#2e3f25]/10 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6a7462] hover:text-[#2a3625] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-[#2a3625]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6a7462] hover:text-[#2a3625] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Aarambh Checkout Order-Bump (on qualifying carts) */}
              {hasQualifyingItem && !hasAarambh && aarambhProduct && (() => {
                const node = aarambhProduct.node;
                const img = node.images?.edges?.[0]?.node;
                const variant = node.variants.edges[0]?.node;
                if (!variant) return null;

                return (
                  <div className="p-4 rounded-2xl border border-dashed border-[#d4af37]/50 bg-[#fffdf8] shadow-sm relative overflow-hidden group/upsell mt-4">
                    {/* Golden top indicator line */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#d4af37]/60 via-[#f5c842] to-[#d4af37]/60" />
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#b58900] bg-[#fff8ed] px-2 py-0.5 rounded-full border border-[#d4af37]/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#d4af37]" /> Exclusive Order-Bump
                      </span>
                      <span className="text-[11px] font-black text-[#4f7a2e]">
                        Only ₹99
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0ece4] flex-shrink-0 border border-[#2e3f25]/5">
                        {img ? (
                          <img src={img.url} alt="Aarambh Starter Set" className="w-full h-full object-cover group-hover/upsell:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🕯️</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4
                          className="text-xs font-bold text-[#2a3625] leading-snug line-clamp-2"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          Add the Aarambh Starter Set — 3 sacred scents — for ₹99
                        </h4>
                        <p className="text-[10px] text-[#6a7462] mt-0.5 line-clamp-2 leading-tight">
                          Experience all 3 signature aromas (Dasangam, Floral, Lemongrass) alongside your order.
                        </p>
                      </div>

                      <div className="flex items-center justify-end flex-shrink-0 ml-1">
                        <button
                          onClick={() => {
                            addItem({
                              product: aarambhProduct,
                              variantId: variant.id,
                              variantTitle: variant.title,
                              price: variant.price,
                              quantity: 1,
                              selectedOptions: variant.selectedOptions || [],
                            });
                          }}
                          className="px-3.5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white transition-all shadow hover:shadow-md hover:scale-[1.03]"
                          style={{ background: "linear-gradient(135deg, #d4af37, #b58900)" }}
                        >
                          + Add ₹99
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Suggestions Section */}
              {suggestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#2e3f25]/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6a7462] mb-3 flex items-center justify-between">
                    <span>{hasOnlyAarambh ? "Add a Pack or Combo to Proceed" : isFreeShipping ? "You might also like" : "Add to reach Free Shipping"}</span>
                    {!isFreeShipping && !hasOnlyAarambh && (
                      <span className="text-[#b56c3d] font-bold">₹{Math.ceil(amountAway)} to go</span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((product) => {
                      const img = product.node.images?.edges?.[0]?.node;
                      const variant = product.node.variants.edges[0]?.node;
                      if (!variant) return null;
                      const isCombo = product.node.title.toLowerCase().includes("combo");
                      return (
                        <div
                          key={product.node.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-[#2e3f25]/8 bg-white hover:border-[#4f7a2e]/30 transition-colors"
                        >
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#f0ece4] flex-shrink-0">
                            {img ? (
                              <img src={img.url} alt={product.node.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-base">🕯️</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p
                                className="text-xs text-[#2a3625] leading-snug line-clamp-1"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                              >
                                {product.node.title}
                              </p>
                              {isCombo && (
                                <span className="text-[8px] font-black bg-[#4f7a2e]/10 text-[#4f7a2e] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                                  Combo
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-[#4f7a2e]">
                              ₹{Math.round(parseFloat(variant.price.amount))}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              addItem({
                                product,
                                variantId: variant.id,
                                variantTitle: variant.title,
                                price: variant.price,
                                quantity: 1,
                                selectedOptions: variant.selectedOptions || [],
                              });
                            }}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white transition-transform hover:scale-105"
                            style={{ background: "#4f7a2e" }}
                          >
                            + Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 py-5 border-t border-[#2e3f25]/8 bg-[#fffbf5] space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-2 pb-2 border-b border-[#2e3f25]/8 text-xs">
              <div className="flex items-center justify-between text-[#6a7462]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2a3625]">₹{Math.round(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6a7462] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6a7462]" /> Shipping
                </span>
                {isFreeShipping ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#6a7462] line-through">₹{FLAT_SHIPPING_FEE}</span>
                    <span className="text-[11px] font-bold text-[#4f7a2e] uppercase tracking-wider bg-[#4f7a2e]/10 px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#2a3625]">₹{FLAT_SHIPPING_FEE}</span>
                    <span className="text-[10px] text-[#6a7462]">(Flat rate)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#6a7462] uppercase tracking-widest block">Estimated Total</span>
                <span className="text-[10px] text-[#6a7462]/70 font-light">Taxes & shipping confirmed at checkout</span>
              </div>
              <span
                className="text-2xl text-[#2a3625]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                ₹{Math.round(estimatedTotal)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0 || hasOnlyAarambh}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white transition-all ${
                isLoading || items.length === 0 || hasOnlyAarambh
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              }`}
              style={{
                background: hasOnlyAarambh
                  ? "#8a9284"
                  : "linear-gradient(135deg, #2e4e18, #4f7a2e)",
              }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : hasOnlyAarambh ? (
                <>Add a pack or combo to checkout</>
              ) : (
                <>Checkout • ₹{Math.round(estimatedTotal)} <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
