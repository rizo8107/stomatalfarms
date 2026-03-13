import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RelatedProductsProps {
  currentProductId: string;
}

export const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(8);
        // Filter out current product and limit to 4
        const filtered = data
          .filter(p => p.node.id !== currentProductId)
          .slice(0, 4);
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentProductId]);

  const handleQuickAdd = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success("Added to cart", {
      description: product.node.title,
      position: "bottom-right",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 border-t border-border/50 bg-gradient-to-b from-transparent to-sage-light/5">
      <div className="container px-4 max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 md:mb-12 tracking-tight">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
          {products.map((product) => {
            const price = product.node.priceRange.minVariantPrice;
            const compareAtPrice = product.node.compareAtPriceRange?.minVariantPrice;
            const image = product.node.images.edges[0]?.node;

            const currentPrice = parseFloat(price.amount);
            const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : 0;
            const hasDiscount = originalPrice > currentPrice;

            return (
              <div key={product.node.id} className="group relative flex flex-col h-full bg-card/40 backdrop-blur-sm rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <Link
                  to={`/product/${product.node.handle}`}
                  className="flex-1"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#f5f0e8]/80 relative">
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 z-10 bg-[#5a8739] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                        Sale
                      </span>
                    )}
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
                        Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>

                  <div className="p-4 md:p-5 flex flex-col gap-2">
                    <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 h-10 group-hover:text-[#5a8739] transition-colors duration-300">
                      {product.node.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-[#5a8739] font-bold text-base md:text-lg whitespace-nowrap">
                        ₹{Math.round(currentPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through opacity-70">
                          ₹{Math.round(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4 md:px-5 md:pb-5">
                  <Button
                    onClick={() => handleQuickAdd(product)}
                    className="w-full bg-[#5a8739] text-white hover:bg-[#5a8739]/90 text-xs h-10 rounded-xl font-bold tracking-wide shadow-sm hover:shadow transition-all duration-300"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-2" />
                    Quick Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

