import { Link } from "react-router-dom";

const categories = [
  {
    name: "Incense Cups",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/8cc70f16-1c6a-4429-97c5-5609582b0b3d.jpg?v=1757489082",
    description: "Handcrafted cups made from cow dung",
    link: "/collections?category=cups",
  },
  {
    name: "Incense Sticks",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/ea0cf119-44bf-493c-b2df-36eab2c43b70.jpg?v=1757489122",
    description: "Bamboo-less sticks with pure herbs",
    link: "/collections?category=sticks",
  },
  {
    name: "Combo Packs",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7b9ccf00-4df1-4412-ab72-bf3a24d59552.jpg?v=1757489157",
    description: "Complete aromatic wellness bundles",
    link: "/collections?category=combos",
  },
  {
    name: "Ghee Lamps",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/4a9b45ef-2389-4561-a655-01e94a2d38e2.jpg?v=1757489189",
    description: "Panchagavya ghee-filled diyas",
    link: "/collections?category=ghee",
  },
  {
    name: "Bath Salts",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/f95000d1-6627-4602-bba0-33a568379747.jpg?v=1757489305",
    description: "Relaxing & detoxifying self-care",
    link: "/collections?category=bath",
  },
  {
    name: "All Products",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/aaWhatsAppImage2025-09-15at18.13.24.jpg?v=1757948321",
    description: "Browse our complete collection",
    link: "/collections",
  },
];

const ProductCategories = () => {
  return (
    <section className="py-20 md:py-28 bg-[#faf7f2] border-t border-[#eae4da] relative shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-10 w-full rounded-t-3xl md:rounded-t-[3rem] -mt-6 md:-mt-10">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5a8739]/30 to-transparent" />

      <div className="container px-4 max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-4 border border-primary/20">
            Aurora Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight tracking-tight">
            Explore Our Handcrafted Products
          </h2>
          <div className="w-12 h-0.5 bg-primary/30 mb-6 rounded-full mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Lab-tested aromatic wellness products made from cow dung & traditional herbs for your family's well-being.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.link}
              className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-5 flex flex-col transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 border border-border/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container - Inset card style */}
              <div className="aspect-[1.1/1] md:aspect-[1.4/1] rounded-[1.2rem] md:rounded-[1.8rem] overflow-hidden mb-3 md:mb-6 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Content Area */}
              <div className="px-1 md:px-2 pb-2 md:pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <h3 className="font-serif text-base md:text-3xl text-foreground font-bold tracking-tight">
                    {category.name}
                  </h3>
                </div>

                <p className="text-muted-foreground text-[10px] md:text-base font-light leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-2 mt-1 md:mt-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;

