import { ShopifyProductsGrid } from "@/components/ShopifyProductsGrid";

const ProductsSection = () => {
  return (
    <section id="products" className="py-16 md:py-20 relative bg-background">
      <div className="container px-4 max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-4 border border-primary/20">
            Featured Products
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight tracking-tight">
            Best Sellers
          </h2>
          <div className="w-12 h-0.5 bg-primary/30 mb-6 rounded-full mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
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
