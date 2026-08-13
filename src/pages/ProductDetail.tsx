import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Loader2, Minus, Plus, ShoppingCart, Truck, Leaf, Shield, Award, MessageCircle, Sparkles } from "lucide-react";
import truckIcon from "@/assets/icons/truck.png";
import { GoogleReviewsCarousel } from "@/components/GoogleReviewsCarousel";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper function to parse description into sections
const parseDescriptionSections = (description: string) => {
  if (!description) return { overview: "", ingredients: "", howToUse: "", details: "", comboIncludes: "" };

  // Remove HTML tags but preserve line breaks
  const cleanText = description
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<b>/gi, '**')
    .replace(/<\/b>/gi, '**')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  let overview = "";
  let ingredients = "";
  let howToUse = "";
  let details = "";
  let comboIncludes = "";

  // Try to find "This combo includes:" section
  const comboMatch = cleanText.match(/This combo includes[:\s]*(.*?)(?=Ingredients|How to Use|Product Details|Individual Characteristics|$)/is);
  if (comboMatch) {
    comboIncludes = comboMatch[1].trim()
      .split(/\n/)
      .filter(line => line.trim() && !line.match(/^[•\-*]\s*$/))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .join('\n');
  }

  // Try to find "Individual Characteristics" or "Product Details" section
  const detailsMatch = cleanText.match(/(?:Individual Characteristics|Product Details)[:\s]*(.*?)(?=How to Use|Ingredients|This combo includes|Delivery Details|$)/is);
  if (detailsMatch) {
    const rawDetails = detailsMatch[1].trim();
    // Split by bullet points or line breaks, preserving structure
    details = rawDetails
      .split(/(?=[•\-*]|\n[A-Z])/g)
      .map(line => line.trim())
      .filter(line => line && line.length > 3)
      .join('\n\n');
  }

  // Try to find ingredients section
  const ingredientsMatch = cleanText.match(/Ingredients[:\s]*(.*?)(?=How to Use|Product Details|Individual Characteristics|$)/is);
  if (ingredientsMatch) {
    ingredients = ingredientsMatch[1].trim();
  }

  // Try to find How to Use section
  const howToUseMatch = cleanText.match(/How to Use[:\s]*(.*?)(?=Ingredients|Product Details|Individual Characteristics|This combo includes|$)/is);
  if (howToUseMatch) {
    howToUse = howToUseMatch[1].trim()
      .replace(/STEP\s*(\d+)\s*[-–—]?\s*/gi, '\nStep $1: ')
      .split(/\n/)
      .filter(line => line.trim())
      .map(line => line.trim())
      .join('\n');
  }

  // Overview is the first part before any sections
  const overviewEnd = cleanText.search(/Ingredients|How to Use|Product Details|This combo includes|Individual Characteristics/i);
  if (overviewEnd > 0) {
    overview = cleanText.substring(0, overviewEnd).trim();
  } else {
    // Determine if text is extremely long, maybe keep it all or truncate very liberally? 
    // User complaint suggests they want to see it. Let's show full text.
    overview = cleanText;
  }

  return { overview, ingredients, howToUse, details, comboIncludes };
};

const FormatMetafieldText = ({ text, isSteps = false, isDetails = false, icon: IconComponent }: { text: string; isSteps?: boolean; isDetails?: boolean; icon?: any }) => {
  if (!text) return null;

  const cleanText = text.replace(/[\u202F\u00A0]/g, ' ').trim();
  const lines = cleanText.split(/\n/);
  const validLines = lines.map(l => l.trim()).filter(l => l.length > 0);

  let stepCounter = 1;

  return (
    <div className={isDetails ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
      {validLines.map((line, idx) => {
        const cleanLine = line.replace(/^(?:STEP|Step)\s*\d+\s*[–-]\s*/i, '').replace(/^[•*-]\s*/, '').trim();

        if (isDetails) {
          const parts = cleanLine.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            return (
              <div key={idx} className="flex flex-col p-4 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-muted/50 transition-all duration-300 group">
                <span className="text-[10px] font-bold text-[#5a8739] uppercase tracking-[0.15em] mb-1 group-hover:translate-x-1 transition-transform">{key}</span>
                <span className="text-sm text-foreground font-semibold leading-relaxed">{value}</span>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex flex-col p-4 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-muted/50 transition-all duration-300 col-span-1 md:col-span-2">
                <span className="text-sm text-foreground font-medium leading-relaxed">{cleanLine}</span>
              </div>
            );
          }
        }

        if (isSteps) {
          const currentStep = stepCounter++;
          return (
            <div key={idx} className="flex gap-4 p-5 bg-[#5a8739]/5 rounded-2xl border border-[#5a8739]/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#5a8739]/40 group-hover:bg-[#5a8739] transition-colors" />
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5a8739] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {currentStep}
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-[#5a8739] uppercase tracking-wider">Step {currentStep}</span>
                <p className="leading-relaxed text-[15px] text-foreground font-medium">{cleanLine}</p>
              </div>
            </div>
          );
        }

        // List items (Nutritional Focus, etc.)
        return (
          <div key={idx} className="flex gap-4 items-start group animation-slide-in">
            <div className="flex-shrink-0 mt-1 md:mt-0.5">
              <div className="w-6 h-6 rounded-lg bg-[#5a8739]/10 flex items-center justify-center text-[#5a8739] group-hover:bg-[#5a8739] group-hover:text-white transition-all duration-300 shadow-sm">
                {IconComponent ? <IconComponent className="w-3.5 h-3.5" /> : <Plus className="w-3 h-3" />}
              </div>
            </div>
            <p className="flex-1 leading-relaxed text-[15px] text-foreground/90 font-medium">
              {cleanLine}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    doorNo: "",
    area: "",
    city: "",
    pincode: "",
  });

  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    // Scroll to top when component mounts or handle changes
    window.scrollTo(0, 0);

    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Product not found</h1>
          <Link to="/collections" className="text-primary hover:underline">
            Return to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;
  const description = product.description || "";
  const descriptionHtml = product.descriptionHtml || "";

  // Get initial values from description splitting for backwards compatibility
  let { overview, ingredients, howToUse, details, comboIncludes } = parseDescriptionSections(description);
  let overviewUsesProductHtml = Boolean(descriptionHtml) &&
    !/Ingredients|How to Use|Product Details|This combo includes|Individual Characteristics/i.test(description);

  // Override with actual Shopify Metafields if they exist
  if (product.combo_includes?.value) comboIncludes = product.combo_includes.value;
  if (product.ingredients?.value) ingredients = product.ingredients.value;
  if (product.ingredients_list?.value) ingredients = product.ingredients_list.value;
  if (product.how_to_use?.value) howToUse = product.how_to_use.value;
  if (product.product_details?.value) details = product.product_details.value;
  if (product.custom_description?.value) {
    overview = product.custom_description.value;
    overviewUsesProductHtml = false;
  }

  // New metafields
  const keyHighlights = product.key_highlights?.value;
  const nutritionalFocus = product.nutritional_focus?.value;
  const harvestWindow = product.harvest_window?.value;
  const deliveryRegion = product.delivery_region?.value;
  const premiumQuality = product.premium_quality?.value;
  const ashUsage = product.ash_usage?.value;
  const safetyInfo = product.safety_info?.value;
  const burningTime = product.burning_time?.value;
  const storage = product.storage?.value;
  const fssaiLicense = product.fssai_license?.value;
  const shelfLife = product.shelf_life?.value;
  const netQuantity = product.net_quantity?.value;
  const customShippingLabel = product.custom_shipping_label?.value;

  // Build a specifications string for the "Product Details" if we have individual specs
  const specs = [];
  if (netQuantity) specs.push(`Net Quantity: ${netQuantity}`);
  if (shelfLife) specs.push(`Shelf Life: ${shelfLife}`);
  if (storage) specs.push(`Storage: ${storage}`);
  if (fssaiLicense) specs.push(`FSSAI License: ${fssaiLicense}`);
  if (harvestWindow) specs.push(`Harvest Window: ${harvestWindow}`);
  if (deliveryRegion) specs.push(`Delivery Region: ${deliveryRegion}`);
  if (premiumQuality) specs.push(`Quality: ${premiumQuality}`);

  const specString = specs.join('\n');
  if (specString) {
    details = details ? `${details}\n${specString}` : specString;
  }

  // Build safety/care string
  const safety = [];
  if (safetyInfo) safety.push(`Safety Info: ${safetyInfo}`);
  if (ashUsage) safety.push(`Ash Usage: ${ashUsage}`);
  if (burningTime) safety.push(`Burning Time: ${burningTime}`);
  const safetyString = safety.join('\n');

  // If we have any of the specific metafields, the main description can just be the overview
  if (product.combo_includes?.value || product.ingredients?.value || product.ingredients_list?.value || product.how_to_use?.value || product.product_details?.value) {
    overview = description;
    overviewUsesProductHtml = Boolean(descriptionHtml);
  }

  // Determine default expanded items (none by default)
  const defaultAccordionValue: string[] = [];

  const isMicrogreens = product.title.toLowerCase().includes('microgreen') ||
    product.title.toLowerCase().includes('leafy') ||
    product.description.toLowerCase().includes('microgreen');

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const shopifyProduct: ShopifyProduct = {
      node: product
    };

    addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });

    toast.success("Added to cart");
  };

  const handleWhatsAppOrder = () => {
    setShowAddressDialog(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const submitWhatsAppOrder = () => {
    if (!addressData.name || !addressData.phone || !addressData.doorNo || !addressData.area || !addressData.city || !addressData.pincode) {
      toast.error("Please fill in all fields");
      return;
    }

    const fullAddress = `${addressData.doorNo}, ${addressData.area}, ${addressData.city} - ${addressData.pincode}`;

    const price = parseFloat(selectedVariant?.price.amount || "0").toFixed(2);
    const productUrl = `https://stomatalfarms.com/products/${product.handle}`;
    const message = `Hi! I want to order:

Product: ${product.title}
Price: Rs. ${price}

Delivery Details:
Name: ${addressData.name}
Phone: ${addressData.phone}
Address: ${fullAddress}

Product Link: ${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=916379033131&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');

    setShowAddressDialog(false);
    setAddressData({ name: "", phone: "", doorNo: "", area: "", city: "", pincode: "" });

    toast.success("Opening WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 md:pt-32 pb-24 md:pb-12">
        <div className="container px-4 max-w-7xl mx-auto">
          <Link
            to="/collections"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 md:mb-8 transition-colors text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-3 md:space-y-4 min-w-0 w-full">
              <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-sage-light/30 border border-border shadow-sm p-2 md:p-4 flex items-center justify-center">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
                  {images.slice(0, 6).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl flex-shrink-0 transition-all bg-white overflow-hidden border-2 ${selectedImage === index
                        ? 'border-[#5a8739] shadow-md'
                        : 'border-border hover:border-[#5a8739]/40'
                        }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Variant Selection - Moved below image/thumbnails */}
              {product.options.length > 0 && product.options[0].values.length > 1 && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="text-sm font-semibold text-foreground mb-3 block">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const variantIndex = product.variants.edges.findIndex(
                            v => v.node.selectedOptions.some(
                              so => so.name === option.name && so.value === value
                            )
                          );
                          return (
                            <button
                              key={value}
                              onClick={() => setSelectedVariantIndex(variantIndex >= 0 ? variantIndex : 0)}
                              className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${selectedVariant?.selectedOptions.some(
                                so => so.name === option.name && so.value === value
                              )
                                ? 'border-[#5a8739] bg-[#5a8739]/10 text-[#5a8739] shadow-sm'
                                : 'border-border hover:border-[#5a8739]/40 hover:bg-sage-light/20'
                                }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 md:space-y-8 min-w-0 w-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-[#5a8739]/10 text-[#5a8739] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#5a8739]/20">
                      Handcrafted
                    </span>
                    <span className="bg-sage-light/30 text-sage-dark text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-border">
                      100% Natural
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-[1.3] md:leading-tight break-words tracking-tight">
                    {product.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-bold text-[#5a8739] tracking-tight">
                      ₹{parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
                    </span>
                  </div>
                  {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base text-muted-foreground line-through decoration-muted-foreground/50 decoration-2">
                        ₹{parseFloat(selectedVariant.compareAtPrice.amount).toFixed(0)}
                      </span>
                      <span className="bg-[#cb6c4c] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(203,108,76,0.4)] whitespace-nowrap">
                        {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Aarambh Exclusive Add-On Callout */}
                {product.handle === "aarambh-the-starter-collection-incense-sticks-by-aurora-stomatal-farms" && (
                  <div className="p-4 rounded-2xl bg-[#fff8ed] border border-[#d4af37]/40 space-y-1.5 animate-fade-in mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#b58900]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span>Exclusive Order Add-On — ₹99 (3 Sacred Scents)</span>
                    </div>
                    <p className="text-xs text-[#6a7462] leading-relaxed">
                      The Aarambh Starter Set features 3 sacred scents (Dasangam, Floral, Lemongrass) and is crafted as an add-on to ride alongside any full-sized pack or combo order.
                    </p>
                  </div>
                )}
              </div>

              {/* Product Overview */}
              {(overview || keyHighlights) && (
                <div className="space-y-6">
                  {overview && (
                    <div className="relative group">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5a8739] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                      {overviewUsesProductHtml ? (
                        <div
                          className="text-foreground/80 leading-[1.8] text-[15px] font-medium italic pl-2 py-1 [&_p]:mb-5 [&_p:last-child]:mb-0"
                          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                      ) : (
                        <div className="text-foreground/80 leading-[1.8] whitespace-pre-line text-[15px] font-medium italic pl-2 py-1">
                          {overview}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Product Details Accordion */}
              {(comboIncludes || ingredients || howToUse || details || nutritionalFocus || safetyString || keyHighlights) && (
                <Accordion
                  type="multiple"
                  defaultValue={defaultAccordionValue}
                  className="w-full space-y-3"
                >
                  {keyHighlights && (
                    <AccordionItem value="highlights" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Plus className="w-5 h-5 text-current" />
                          </div>
                          Key Highlights
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={keyHighlights} icon={Plus} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {comboIncludes && (
                    <AccordionItem value="combo-includes" className="border-b border-border/60 first:border-t-0 last:border-b-0 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Plus className="w-5 h-5" />
                          </div>
                          This Combo Includes
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={comboIncludes} icon={Leaf} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {ingredients && (
                    <AccordionItem value="ingredients" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Leaf className="w-5 h-5" />
                          </div>
                          Ingredients & Aroma
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={ingredients} icon={Shield} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {howToUse && (
                    <AccordionItem value="how-to-use" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Award className="w-5 h-5" />
                          </div>
                          How to Use
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={howToUse} isSteps />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {nutritionalFocus && (
                    <AccordionItem value="nutritional-focus" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Shield className="w-5 h-5" />
                          </div>
                          Nutritional Focus
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={nutritionalFocus} icon={Leaf} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {safetyString && (
                    <AccordionItem value="safety-care" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Shield className="w-5 h-5" />
                          </div>
                          Safety & Care
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={safetyString} isDetails />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {details && (
                    <AccordionItem value="details" className="border-b border-border/60 overflow-hidden">
                      <AccordionTrigger className="text-[17px] font-serif font-semibold py-6 hover:no-underline text-foreground group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                            <Truck className="w-5 h-5" />
                          </div>
                          Product Specifications
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pl-14">
                        <FormatMetafieldText text={details} isDetails />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}

              {/* Fallback if no structured content */}
              {!overview && !ingredients && !howToUse && !details && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Premium handcrafted aromatic product made with natural ingredients and traditional herbs.
                </p>
              )}


              {/* Quantity & Add to Cart/WhatsApp - Desktop */}
              <div className="hidden md:flex items-center gap-4 pt-4">
                {!isMicrogreens && (
                  <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none hover:bg-sage-light/30"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold border-x-2 border-border h-12 flex items-center justify-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-none hover:bg-sage-light/30"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isMicrogreens ? (
                  <Button
                    onClick={handleWhatsAppOrder}
                    size="lg"
                    className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    disabled={!selectedVariant?.availableForSale}
                  >
                    {selectedVariant?.availableForSale ? 'Order on WhatsApp' : 'Out of Stock'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    disabled={!selectedVariant?.availableForSale}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                )}
              </div>

              {/* Trust Badges / Delivery Info */}
              {isMicrogreens ? (
                <div className="pt-6 border-t border-border">
                  <div className="bg-[#5a8739]/10 border-2 border-[#5a8739] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img src={truckIcon} alt="Delivery" className="h-8 w-8 object-contain flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1 text-sm">
                          {customShippingLabel || "Fresh Harvest Delivery"}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Microgreens require same-day harvest and doorstep delivery, so a standard delivery charge of ₹100 applies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-6 border-t border-border">
                  {/* Shipping Assurance Banner */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#fffbf5] border border-[#2e3f25]/10 text-xs text-[#2a3625]">
                    <div className="w-8 h-8 rounded-lg bg-[#4f7a2e]/10 flex items-center justify-center text-[#4f7a2e] flex-shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="leading-snug">
                      <span className="font-bold text-[#2e4e18]">Free Shipping over ₹999</span>
                      <span className="text-[#6a7462]"> · ₹60 flat shipping below ₹999 · No minimum order</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 text-sm text-foreground bg-[#5a8739]/5 rounded-xl p-4 border border-[#5a8739]/10 shadow-sm">
                      <Leaf className="h-6 w-6 text-[#5a8739] flex-shrink-0" />
                      <span className="font-medium">100% Natural</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground bg-[#5a8739]/5 rounded-xl p-4 border border-[#5a8739]/10 shadow-sm">
                      <Shield className="h-6 w-6 text-[#5a8739] flex-shrink-0" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground bg-[#5a8739]/5 rounded-xl p-4 border border-[#5a8739]/10 shadow-sm">
                      <Award className="h-6 w-6 text-[#5a8739] flex-shrink-0" />
                      <span className="font-medium">Premium Quality</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Google Reviews */}
        <GoogleReviewsCarousel />

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
      </main>

      {/* Mobile Sticky Add to Cart/WhatsApp Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 z-40">
        <div className="flex items-center gap-3">
          {!isMicrogreens && (
            <div className="flex items-center gap-1.5 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}

          {isMicrogreens ? (
            <Button
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white h-10 font-bold text-sm whitespace-nowrap"
              disabled={!selectedVariant?.availableForSale}
            >
              {selectedVariant?.availableForSale ? 'Order on WhatsApp' : 'Out of Stock'}
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white h-10"
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          )}
        </div>
      </div>

      <Footer />

      {/* Address Collection Dialog for Microgreens */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Please provide your delivery information to complete your order via WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={addressData.name}
                onChange={handleAddressChange}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={addressData.phone}
                onChange={handleAddressChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="doorNo" className="text-sm font-medium text-foreground mb-2 block">
                  Door No / Street *
                </label>
                <Input
                  id="doorNo"
                  name="doorNo"
                  type="text"
                  value={addressData.doorNo}
                  onChange={handleAddressChange}
                  placeholder="e.g. 12/A, Park St"
                  className="w-full"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="area" className="text-sm font-medium text-foreground mb-2 block">
                  Area / Landmark *
                </label>
                <Input
                  id="area"
                  name="area"
                  type="text"
                  value={addressData.area}
                  onChange={handleAddressChange}
                  placeholder="e.g. Anna Nagar"
                  className="w-full"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="city" className="text-sm font-medium text-foreground mb-2 block">
                  City *
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder="e.g. Chennai"
                  className="w-full"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="pincode" className="text-sm font-medium text-foreground mb-2 block">
                  Pincode *
                </label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={addressData.pincode}
                  onChange={handleAddressChange}
                  placeholder="600XXX"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddressDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={submitWhatsAppOrder}
              className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;

