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
      position: "top-center",
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
    <section className="py-12 md:py-16 border-t border-border">
      <div className="container px-4 max-w-6xl mx-auto">
        <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6 md:mb-8">
          You May Also Like
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => {
            const price = product.node.priceRange.minVariantPrice;
            const image = product.node.images.edges[0]?.node;
            
            return (
              <div key={product.node.id} className="group">
                <Link 
                  to={`/product/${product.node.handle}`}
                  className="block"
                >
                  <div className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-sage/5 border border-border mb-2 md:mb-3">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-foreground text-xs md:text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.node.title}
                  </h3>
                  
                  <p className="text-primary font-semibold text-sm md:text-base">
                    {price.currencyCode === 'INR' ? 'INR' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                  </p>
                </Link>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs md:text-sm h-8 md:h-9"
                  onClick={() => handleQuickAdd(product)}
                >
                  <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                  Quick Add
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
