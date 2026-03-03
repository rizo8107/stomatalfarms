import { ShopifyProductsGrid } from "@/components/ShopifyProductsGrid";

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 md:py-32 relative bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)] z-10 w-full rounded-t-3xl md:rounded-t-[3rem] -mt-6 md:-mt-10 border-t border-border">
      <div className="container px-4 max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-4 border border-primary/20">
            Featured Products
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight tracking-tight">
            Best Sellers
          </h2>
          <div className="w-12 h-0.5 bg-primary/30 mb-6 rounded-full mx-auto" />
          <p className="text-black max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
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
