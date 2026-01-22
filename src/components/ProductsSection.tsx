import { ShopifyProductsGrid } from "@/components/ShopifyProductsGrid";

const ProductsSection = () => {
  return (
    <section id="products" className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-primary text-xs uppercase tracking-[0.2em] mb-3 block">
            Featured Products
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Aurora cow dung incense — lab-tested for your family's well-being. Beyond rituals, a daily touch of nature.
          </p>
        </div>

        {/* Products Grid - Now from Shopify */}
        <ShopifyProductsGrid />
      </div>
    </section>
  );
};

export default ProductsSection;
