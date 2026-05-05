import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Loader2, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const CartDrawer = () => {
  const {
    items,
    isLoading,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    createCheckout,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  const handleCheckout = async () => {
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
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
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
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
                    className="flex gap-4 p-4 rounded-2xl border border-[#2e3f25]/8 bg-white"
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f0ece4] flex-shrink-0">
                      {image ? (
                        <img src={image.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🕯️</div>
                      )}
                    </div>

                    {/* Info */}
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

                    {/* Qty + remove */}
                    <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[#6a7462]/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 border border-[#2e3f25]/10 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6a7462] hover:text-[#2a3625] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-[#2a3625]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6a7462] hover:text-[#2a3625] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#2e3f25]/8 bg-[#fffbf5] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#6a7462] uppercase tracking-widest text-[10px]">Total</span>
              <span
                className="text-2xl text-[#2a3625]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                ₹{Math.round(totalPrice)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <>Checkout <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
            <p className="text-center text-[10px] text-[#6a7462]/50 uppercase tracking-widest">
              Free shipping on orders ₹599+
            </p>
          </div>
        )}
      </div>
    </>
  );
};
