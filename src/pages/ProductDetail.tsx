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
import { ChevronLeft, Loader2, Minus, Plus, ShoppingCart, Truck, Leaf, Shield, Award } from "lucide-react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import truckIcon from "@/assets/icons/truck.png";
import leafIcon from "@/assets/icons/leaf.png";
import shieldIcon from "@/assets/icons/shield.png";
import awardIcon from "@/assets/icons/award.png";
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

const FormatMetafieldText = ({ text, isSteps = false, isDetails = false }: { text: string; isSteps?: boolean; isDetails?: boolean }) => {
  if (!text) return null;

  // Clean up extra invisible spaces, line breaks, and narrow non-breaking spaces
  const cleanText = text.replace(/[\u202F\u00A0]/g, ' ').trim();

  // Split the text block by double newlines or single newlines, ensuring we handle multiple carriage returns smoothly
  const lines = cleanText.split(/\n/);

  // Reconstruct paragraphs, grouping consecutive non-empty lines that don't start with a bullet into logic chunks,
  // but to keep it simple, let's just render line by line if it's not empty.
  const validLines = lines.map(l => l.trim()).filter(l => l.length > 0);

  let stepCounter = 1;

  return (
    <div className={isDetails ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" : "space-y-4"}>
      {validLines.map((line, idx) => {
        // Strip out existing manual "STEP 1 -" labels just in case the user hasn't removed them yet
        const cleanLine = line.replace(/^(?:STEP|Step)\s*\d+\s*[–-]\s*/i, '').trim();

        if (isDetails) {
          // Detect key-value patterns like "Total Quantity: 45 cups"
          const parts = cleanLine.replace(/^[•-]\s*/, '').split(':');

          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            return (
              <div key={idx} className="flex flex-col p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
                <span className="text-xs font-bold text-[#8dcc5b] uppercase tracking-wider mb-1.5">{key}</span>
                <span className="text-sm text-foreground font-medium leading-relaxed">{value}</span>
              </div>
            );
          } else {
            // Fallback for details without a colon
            const rest = cleanLine.replace(/^[•-]\s*/, '').trim();
            return (
              <div key={idx} className="flex flex-col p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all col-span-1 md:col-span-2">
                <span className="text-sm text-foreground font-medium leading-relaxed">{rest}</span>
              </div>
            );
          }
        }

        if (isSteps) {
          const currentStep = stepCounter++;
          return (
            <div key={idx} className="flex flex-col gap-2 bg-[#8dcc5b]/5 p-4 rounded-xl border border-[#8dcc5b]/20">
              <span className="inline-flex items-center justify-center rounded-md bg-[#8dcc5b]/20 px-2.5 py-1 text-xs font-bold text-[#5c8a2b] uppercase tracking-wider w-fit">
                Step {currentStep}
              </span>
              <span className="leading-relaxed text-sm text-foreground">{cleanLine}</span>
            </div>
          );
        }

        // Detect bullet points
        const isBullet = cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*');
        if (isBullet) {
          const rest = cleanLine.slice(1).trim();
          return (
            <div key={idx} className="flex gap-3 items-start relative before:absolute before:left-0 before:top-0">
              <span className="text-[#8dcc5b] font-bold text-lg leading-6 flex-shrink-0 mt-0.5">•</span>
              <span className="flex-1 leading-relaxed text-sm text-foreground">{rest}</span>
            </div>
          );
        }

        // Just regular text
        return (
          <p key={idx} className="leading-relaxed text-sm text-foreground">
            {cleanLine}
          </p>
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
    address: "",
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

  // Get initial values from description splitting for backwards compatibility
  let { overview, ingredients, howToUse, details, comboIncludes } = parseDescriptionSections(description);

  // Override with actual Shopify Metafields if they exist
  if (product.combo_includes?.value) comboIncludes = product.combo_includes.value;
  if (product.ingredients?.value) ingredients = product.ingredients.value;
  if (product.ingredients_list?.value) ingredients = product.ingredients_list.value;
  if (product.how_to_use?.value) howToUse = product.how_to_use.value;
  if (product.product_details?.value) details = product.product_details.value;

  // If we have any of the specific metafields, the main description can just be the overview
  if (product.combo_includes?.value || product.ingredients?.value || product.ingredients_list?.value || product.how_to_use?.value || product.product_details?.value) {
    overview = description;
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

    toast.success("Added to cart", {
      description: `${product.title} × ${quantity}`,
      position: "bottom-right",
    });
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
    if (!addressData.name || !addressData.phone || !addressData.address) {
      toast.error("Please fill in all fields", {
        position: "top-center",
      });
      return;
    }

    const price = parseFloat(selectedVariant?.price.amount || "0").toFixed(2);
    const productUrl = `https://stomatalfarms.com/products/${product.handle}`;
    const message = `Hi! I want to order:

Product: ${product.title}
Price: Rs. ${price}

Delivery Details:
Name: ${addressData.name}
Phone: ${addressData.phone}
Address: ${addressData.address}

Product Link: ${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=916379033131&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');

    setShowAddressDialog(false);
    setAddressData({ name: "", phone: "", address: "" });

    toast.success("Opening WhatsApp...", {
      description: "Your order details have been prepared",
      position: "top-center",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-28 pb-24 md:pb-12">
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
                        ? 'border-[#8dcc5b] shadow-md'
                        : 'border-border hover:border-[#8dcc5b]/40'
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
            </div>

            {/* Product Info */}
            <div className="space-y-6 md:space-y-8 min-w-0 w-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-[#8dcc5b]/10 text-[#8dcc5b] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#8dcc5b]/20">
                      Handcrafted
                    </span>
                    <span className="bg-sage-light/30 text-sage-dark text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-border">
                      100% Natural
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-[1.1] md:leading-tight break-words tracking-tight">
                    {product.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-bold text-[#8dcc5b] tracking-tight">
                      ₹{parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
                    </span>
                  </div>
                  {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base text-muted-foreground line-through decoration-muted-foreground/50 decoration-2">
                        ₹{parseFloat(selectedVariant.compareAtPrice.amount).toFixed(0)}
                      </span>
                      <span className="bg-[#8dcc5b] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm w-fit text-center">
                        SAVE {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Overview */}
              {overview && (
                <div className="prose prose-sm max-w-none">
                  <div className="text-foreground/80 leading-[1.8] whitespace-pre-line text-[15px] font-light italic border-l-2 border-sage-light pl-4 py-1">
                    {overview}
                  </div>
                </div>
              )}

              {/* Product Details Accordion */}
              {(comboIncludes || ingredients || howToUse || details) && (
                <Accordion
                  type="multiple"
                  defaultValue={defaultAccordionValue}
                  className="w-full space-y-3"
                >
                  {comboIncludes && (
                    <AccordionItem value="combo-includes" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        This Combo Includes
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <FormatMetafieldText text={comboIncludes} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {ingredients && (
                    <AccordionItem value="ingredients" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        Ingredients
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <FormatMetafieldText text={ingredients} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {howToUse && (
                    <AccordionItem value="how-to-use" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        How to Use
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <FormatMetafieldText text={howToUse} isSteps />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {details && (
                    <AccordionItem value="details" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        Product Details
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pt-2">
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

              {/* Variant Selection */}
              {product.options.length > 0 && product.options[0].values.length > 1 && (
                <div className="space-y-4">
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
                                ? 'border-[#8dcc5b] bg-[#8dcc5b]/10 text-[#8dcc5b] shadow-sm'
                                : 'border-border hover:border-[#8dcc5b]/40 hover:bg-sage-light/20'
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
                    className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    disabled={!selectedVariant?.availableForSale}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {selectedVariant?.availableForSale ? 'Buy via WhatsApp' : 'Out of Stock'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
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
                  <div className="bg-[#8dcc5b]/10 border-2 border-[#8dcc5b] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img src={truckIcon} alt="Delivery" className="h-8 w-8 object-contain flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1 text-sm"> Fresh Harvest Delivery</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Microgreens require same-day harvest and doorstep delivery, so a standard delivery charge of ₹100 applies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <img src={truckIcon} alt="Free Shipping" className="h-8 w-8 object-contain flex-shrink-0" />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <img src={leafIcon} alt="Natural" className="h-8 w-8 object-contain flex-shrink-0" />
                    <span className="font-medium">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <img src={shieldIcon} alt="Secure" className="h-8 w-8 object-contain flex-shrink-0" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <img src={awardIcon} alt="Premium" className="h-8 w-8 object-contain flex-shrink-0" />
                    <span className="font-medium">Premium Quality</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
              className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white h-10"
              disabled={!selectedVariant?.availableForSale}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {selectedVariant?.availableForSale ? 'Buy via WhatsApp' : 'Out of Stock'}
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white h-10"
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

            <div>
              <label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Delivery Address *
              </label>
              <Textarea
                id="address"
                name="address"
                value={addressData.address}
                onChange={handleAddressChange}
                placeholder="Enter your complete delivery address"
                rows={4}
                className="w-full resize-none"
              />
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
              className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white"
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
