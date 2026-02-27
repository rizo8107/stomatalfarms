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
    <section className="py-12 md:py-16 bg-gradient-to-b from-transparent via-sage-light/20 to-sage-light/40 border-y border-border/40">
      <div className="container px-4 max-w-7xl mx-auto">
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
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative aspect-square rounded-2xl overflow-hidden animate-fade-in-up shadow-md hover:shadow-xl transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-earth/80 via-earth/30 to-transparent transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="font-serif text-lg md:text-xl text-warm-white font-medium leading-tight">
                  {category.name}
                </h3>
                <p className="text-warm-white/70 text-xs mt-1 hidden md:block">
                  {category.description}
                </p>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
