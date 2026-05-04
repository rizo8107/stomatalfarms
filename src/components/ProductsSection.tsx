import { ShopifyProductsGrid } from "@/components/ShopifyProductsGrid";

const ProductsSection = () => (
  <section id="products" className="py-12 md:py-16 px-4 bg-[#fffbf5]">
    <div className="max-w-7xl mx-auto">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
        ✦ Shop by Product
      </p>
      <h2
        className="text-center text-2xl md:text-4xl text-[#1e2519] mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        What would you like today?
      </h2>
      <p className="text-center text-sm text-[#6a7462] mb-8 font-light max-w-md mx-auto">
        Aurora cow dung incense — lab-tested for your family's well-being. Beyond rituals, a daily touch of nature.
      </p>
      <ShopifyProductsGrid />
    </div>
  </section>
);

export default ProductsSection;
