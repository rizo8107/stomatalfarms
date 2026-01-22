import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "./ShopifyProductCard";
import { Loader2 } from "lucide-react";

export const ShopifyProductsGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(12);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-2xl text-foreground mb-3">No products yet</h3>
          <p className="text-muted-foreground">
            Products will appear here once added to your Shopify store. Ask me to create your first incense product!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => (
        <ShopifyProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
};
