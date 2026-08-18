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
import { ChevronLeft, Loader2, Minus, Plus, ShoppingCart, Truck, Leaf, Shield, Award, MessageCircle, Sparkles, FileText, Package, HelpCircle, Info } from "lucide-react";
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

  const sectionDelimiters = "(?:Ingredients|How to [Uu]se|Directions|Product [Dd]etails|Product [Ss]pecifications|Specifications|Individual Characteristics|Combo [Ii]ncludes|This [Cc]ombo [Ii]ncludes|What'?s [Ii]nside|Delivery Details|Safety|$)";

  // Try to find "This combo includes:" section
  const comboMatch = cleanText.match(new RegExp(`(?:This combo includes|Combo includes|What'?s inside|Box contains|Package includes|Includes|Items included)[:\\s]*(.*?)(?=${sectionDelimiters})`, "is"));
  if (comboMatch && comboMatch[1].trim().length > 3) {
    comboIncludes = comboMatch[1].trim()
      .split(/\n/)
      .filter(line => line.trim() && !line.match(/^[•\-*]\s*$/))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .join('\n');
  }

  // Try to find "Individual Characteristics" or "Product Details / Specifications" section
  const detailsMatch = cleanText.match(new RegExp(`(?:Individual Characteristics|Product Details|Product Specifications|Specifications|Key Specifications|Specs|Features)[:\\s]*(.*?)(?=${sectionDelimiters})`, "is"));
  if (detailsMatch && detailsMatch[1].trim().length > 3) {
    const rawDetails = detailsMatch[1].trim();
    details = rawDetails
      .split(/(?=[•\-*]|\n[A-Z])/g)
      .map(line => line.trim())
      .filter(line => line && line.length > 3)
      .join('\n\n');
  }

  // Try to find ingredients section
  const ingredientsMatch = cleanText.match(new RegExp(`(?:Ingredients|Ingredients & Aroma|Aroma|Sacred Ingredients|Composition)[:\\s]*(.*?)(?=${sectionDelimiters})`, "is"));
  if (ingredientsMatch && ingredientsMatch[1].trim().length > 3) {
    ingredients = ingredientsMatch[1].trim();
  }

  // Try to find How to Use section
  const howToUseMatch = cleanText.match(new RegExp(`(?:How to [Uu]se|Directions for [Uu]se|Directions|Usage|How to [Ll]ight)[:\\s]*(.*?)(?=${sectionDelimiters})`, "is"));
  if (howToUseMatch && howToUseMatch[1].trim().length > 3) {
    howToUse = howToUseMatch[1].trim()
      .replace(/STEP\s*(\d+)\s*[-–—:]?\s*/gi, '\nStep $1: ')
      .split(/\n/)
      .filter(line => line.trim())
      .map(line => line.trim())
      .join('\n');
  }

  // Overview is the first part before any sections
  const overviewEnd = cleanText.search(/(?:Ingredients|How to [Uu]se|Directions|Product [Dd]etails|Product [Ss]pecifications|Specifications|This [Cc]ombo [Ii]ncludes|Combo [Ii]ncludes|What'?s [Ii]nside|Individual Characteristics)/i);
  if (overviewEnd > 0) {
    overview = cleanText.substring(0, overviewEnd).trim();
  } else if (overviewEnd === 0) {
    overview = "";
  } else {
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    doorNo: "",
    area: "",
    city: "",
    pincode: "",
  });

  const addItem = useCartStore(state => state.addItem);
  const createCheckout = useCartStore(state => state.createCheckout);

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

  const t = product.title.toLowerCase();
  const h = product.handle.toLowerCase();
  const isCombo = t.includes('combo') || h.includes('combo');
  const isCup = t.includes('cup') || h.includes('cup') || t.includes('dhoop') || h.includes('dhoop') || t.includes('arka') || h.includes('arka');
  const isStick = t.includes('stick') || h.includes('stick') || t.includes('aarambh') || h.includes('aarambh') || t.includes('incense') || h.includes('incense');
  const isMicrogreens = t.includes('microgreen') || h.includes('microgreen') || product.description.toLowerCase().includes('microgreen');

  // Fallback for comboIncludes / What's inside
  if (!comboIncludes || comboIncludes.trim().length === 0) {
    if (isCombo && isCup) {
      comboIncludes = "15 Dasangam Sacred Incense Cups\n15 Floral Harmony Incense Cups\n15 Lemongrass Calming Incense Cups\n3 Handcrafted Natural Holders\n45g Herbal Dhoop Powder";
    } else if (isCombo && isStick) {
      comboIncludes = "30 Dasangam Sacred Incense Sticks\n30 Floral Harmony Incense Sticks\n30 Lemongrass Calming Incense Sticks\n3 Handcrafted Incense Stands";
    } else if (h.includes('arka') || t.includes('arka')) {
      comboIncludes = "30 Handcrafted Arka Incense Cups\n30g Sacred Herbal Powder\n1 Natural Clay/Ceramic Burner Holder";
    } else if (h.includes('aarambh') || t.includes('aarambh')) {
      comboIncludes = "30 Bamboo-less Sacred Incense Sticks (Dasangam, Floral, Lemongrass)\n1 Handcrafted Wooden Stand";
    } else if (isCup) {
      comboIncludes = "30 Handcrafted Sacred Incense Cups\n30g Herbal Dhoop Powder\n1 Natural Burner Holder";
    } else if (isMicrogreens) {
      comboIncludes = "1 Live Tray of Nutrient-Dense Fresh Microgreens\nHarvest & Freshness Guide";
    } else if (netQuantity) {
      comboIncludes = netQuantity;
    } else {
      comboIncludes = "Handcrafted Authentic Natural Pack\n100% Organic & Chemical-Free";
    }
  }

  // Fallback for howToUse
  if (!howToUse || howToUse.trim().length === 0) {
    if (isCup) {
      howToUse = "Step 1: Hold the incense cup by its base and tilt it at a 45-degree angle.\nStep 2: Light the top outer rim until a consistent flame appears (approx. 10–15 seconds).\nStep 3: Gently blow out the flame and let the sacred herbal blend smolder.\nStep 4: Place the cup onto the provided heat-resistant holder in a well-ventilated area.";
    } else if (isStick) {
      howToUse = "Step 1: Light the tip of the incense stick until it catches a gentle flame.\nStep 2: Gently blow out the flame to reveal a glowing red ember.\nStep 3: Place securely into the incense holder away from flammable materials.";
    } else if (isMicrogreens) {
      howToUse = "Step 1: Snip the greens just above the root line using clean scissors.\nStep 2: Gently rinse in cold water and pat dry.\nStep 3: Garnish salads, wraps, curries, or blend into morning smoothies.";
    } else {
      howToUse = "Step 1: Light in a safe, well-ventilated space.\nStep 2: Allow the sacred aroma to disperse gently.\nStep 3: Keep away from flammable surfaces and direct reach of children.";
    }
  }

  // Fallback for details / product specifications
  if (!details || details.trim().length === 0) {
    if (isCombo && isCup) {
      details = "Net Quantity: 45 Incense Cups (3 Packs) + 3 Holders\nBurn Time: 35–45 minutes per cup\nAroma: Dasangam, Floral & Lemongrass\nShelf Life: 24 Months\nQuality: 100% Charcoal-Free & Desi Cow Dung Based\nStorage: Store in a cool, dry place away from moisture\nCountry of Origin: India";
    } else if (h.includes('arka') || t.includes('arka')) {
      details = "Net Quantity: 30 Incense Cups + 1 Holder\nBurn Time: 35–40 minutes per cup\nPrimary Material: Native Desi Cow Dung & Sacred Herbs\nShelf Life: 24 Months\nTesting: Lab Tested · No Synthetic Fragrances\nStorage: Store in a cool, dry place\nCountry of Origin: India";
    } else if (isCup) {
      details = "Net Quantity: 30 Incense Cups + 1 Holder\nBurn Time: 35–40 minutes per cup\nShelf Life: 24 Months\nQuality: 100% Charcoal-Free & Pure Natural\nStorage: Store in a cool, dry place\nCountry of Origin: India";
    } else if (isStick) {
      details = "Net Quantity: 30 Incense Sticks + 1 Stand\nBurn Time: 40–45 minutes per stick\nMaterial: Bamboo-less Natural Herb & Essential Oil Blend\nShelf Life: 24 Months\nCountry of Origin: India";
    } else if (isMicrogreens) {
      details = "Net Quantity: 1 Fresh Living Tray (~120g)\nShelf Life: 5–7 Days Refrigerated\nFarming Method: 100% Organic Soil Cultivation · Pesticide-Free\nHarvest Window: Harvested on the morning of delivery";
    } else {
      details = "Quality: 100% Natural & Handcrafted\nShelf Life: 24 Months\nStorage: Store in a cool, dry place\nCountry of Origin: India";
    }
  }

  // Determine default expanded items (none by default)
  const defaultAccordionValue: string[] = [];

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    if (isMicrogreens) {
      handleWhatsAppOrder();
      return;
    }

    setIsCheckingOut(true);
    try {
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

      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (e) {
      console.error(e);
      toast.error("Checkout failed. Please try adding to cart.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Dynamic Box Items for the 3 Metric Cards
  const boxItems = (() => {
    const rawText = comboIncludes || netQuantity || "";
    const lines = rawText.split(/\n|·|,/).map(s => s.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean);
    
    if (lines.length >= 3) {
      return lines.slice(0, 3).map(item => {
        const match = item.match(/^(\d+(?:\s*[a-zA-Z]+)?|\d+)\s+(.*)$/);
        if (match) {
          return { value: match[1], label: match[2] };
        }
        return { value: "1", label: item };
      });
    }

    if (h.includes('arka') || t.includes('arka')) {
      return [
        { value: "30", label: "incense cups" },
        { value: "30g", label: "herbal powder" },
        { value: "1", label: "holder" }
      ];
    }

    if (isCombo && isCup) {
      return [
        { value: "45", label: "incense cups" },
        { value: "45g", label: "herbal powder" },
        { value: "3", label: "holders" }
      ];
    }

    if (isStick || h.includes('aarambh') || t.includes('aarambh')) {
      return [
        { value: "30", label: "incense sticks" },
        { value: "3", label: "sacred scents" },
        { value: "1", label: "holder" }
      ];
    }

    if (isMicrogreens) {
      return [
        { value: "1", label: "living tray" },
        { value: "120g", label: "fresh harvest" },
        { value: "1", label: "care guide" }
      ];
    }

    if (isCup) {
      return [
        { value: "30", label: "incense cups" },
        { value: "30g", label: "herbal powder" },
        { value: "1", label: "holder" }
      ];
    }

    return [
      { value: "1", label: "pure pack" },
      { value: "100%", label: "natural herbs" },
      { value: "1", label: "artisan blend" }
    ];
  })();

  // Dynamic pill tags
  const pillTags = (() => {
    const tags: string[] = [];
    const desc = (product.description || "").toLowerCase();
    
    if (desc.includes('cow dung') || t.includes('cow dung') || h.includes('arka') || h.includes('aurora') || isCup) {
      tags.push("Cow dung based");
    }
    tags.push("Lab tested");
    tags.push("No synthetic fragrance");
    tags.push("No charcoal");
    
    if (product.ash_usage?.value || desc.includes('ash') || isCup || h.includes('arka')) {
      tags.push("Zero-waste ash");
    } else if (isMicrogreens) {
      tags.push("100% Organically grown");
    } else {
      tags.push("Zero-waste ash");
    }
    return tags;
  })();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const shopifyProduct: ShopifyProduct = { node: product };
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

            {/* Product Info - Minimal & Premium Design */}
            <div className="space-y-6 min-w-0 w-full">
              {/* Main Premium White Card */}
              <div className="bg-white rounded-[28px] border border-[#e2e7db] p-6 sm:p-8 md:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
                
                {/* Top Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e6ede0] text-[#4d6630] border border-[#d6e3cb]">
                    HANDCRAFTED
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#f6eee3] text-[#86663f] border border-[#ebd8c4]">
                    100% NATURAL
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-[40px] font-normal text-[#222a1c] leading-tight tracking-tight">
                    {(() => {
                      const t = product.title;
                      if (t.toLowerCase().includes('arka')) {
                        return 'ARKA — Cow Dung Incense Cups';
                      }
                      if (t.includes(' - ')) {
                        return t.replace(' - ', ' — ');
                      }
                      return t;
                    })()}
                  </h1>
                  <p className="font-serif italic text-[15px] sm:text-base text-[#6f6e5b]">
                    {(() => {
                      if (product.title.toLowerCase().includes('arka')) {
                        return 'The Original Blend · Camphor, Frankincense & Herbs';
                      }
                      if (product.ingredients_list?.value) return product.ingredients_list.value;
                      if (product.ingredients?.value) return product.ingredients.value;
                      const parts = product.title.split(/[-–—:]/);
                      if (parts.length > 1) return parts.slice(1).join(' · ').trim();
                      return 'The Original Blend · 100% Pure Botanical Herbs';
                    })()}
                  </p>
                </div>

                {/* Poetic Tagline Hook */}
                <div className="font-serif italic text-lg sm:text-xl text-[#4e652f] leading-snug">
                  {(() => {
                    if (h.includes('arka') || t.includes('arka')) {
                      return "One cup a day. Thirty days of calm.";
                    }
                    if (h.includes('aarambh') || t.includes('aarambh')) {
                      return "Pure sacred aroma. Three divine scents for daily calm.";
                    }
                    if (isMicrogreens) {
                      return "Harvested fresh on order. Pure vibrant wellness.";
                    }
                    return "One cup a day. Thirty days of calm.";
                  })()}
                </div>

                {/* Pricing Block */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-[#445b27] tracking-tight font-sans">
                      ₹{parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
                    </span>
                    {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                      <>
                        <span className="text-lg sm:text-xl text-[#959d8c] line-through font-normal decoration-1 decoration-[#959d8c]">
                          ₹{parseFloat(selectedVariant.compareAtPrice.amount).toFixed(0)}
                        </span>
                        <span className="bg-[#b95738] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}% OFF
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#5c4a3b]">
                          Save ₹{Math.round(parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount))}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#7e8874] font-normal mt-1.5">
                    MRP incl. all taxes · {parseFloat(selectedVariant?.price.amount || "0") >= 999 ? 'Free Delivery' : 'Delivery ₹60'} · Ships in 2–3 days
                  </p>
                </div>

                {/* Variant Options Selection (if applicable) */}
                {product.options.length > 0 && product.options[0].values.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-[#edf1e7]">
                    {product.options.map((option) => (
                      <div key={option.name}>
                        <label className="text-xs font-semibold text-[#48533e] mb-2 block uppercase tracking-wider">
                          {option.name}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const variantIndex = product.variants.edges.findIndex(
                              v => v.node.selectedOptions.some(
                                so => so.name === option.name && so.value === value
                              )
                            );
                            const isSelected = selectedVariant?.selectedOptions.some(
                              so => so.name === option.name && so.value === value
                            );
                            return (
                              <button
                                key={value}
                                onClick={() => setSelectedVariantIndex(variantIndex >= 0 ? variantIndex : 0)}
                                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                                  isSelected
                                    ? 'border-[#4e6231] bg-[#4e6231]/10 text-[#4e6231] shadow-sm'
                                    : 'border-[#d8e0ce] text-[#4f5945] hover:border-[#4e6231]/50 bg-[#fafcf7]'
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

                {/* WHAT'S IN THE BOX Metric Grid */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#776856] block">
                    WHAT'S IN THE BOX
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {boxItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#fcfbf7] rounded-2xl border border-[#ebe6dc] p-3 sm:p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[85px]"
                      >
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-[#232a1c] leading-none">
                          {item.value}
                        </span>
                        <span className="text-xs text-[#6e7764] font-medium mt-1.5 leading-tight text-center">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pill Tags Row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {pillTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-[#f2efe9] text-[#4d5743] border border-[#e5e0d5] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quantity adjustment & Dual CTA Buttons Section */}
                <div className="space-y-3 pt-2">
                  {!isMicrogreens && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#546048] uppercase tracking-wider">Quantity</span>
                      <div className="flex items-center border border-[#d8e0ce] rounded-xl overflow-hidden bg-[#fafcf7]">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-[#edf2e6] text-[#333d2a]"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-[#27321e]">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-[#edf2e6] text-[#333d2a]"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Dual CTA Buttons */}
                  {isMicrogreens ? (
                    <Button
                      onClick={handleWhatsAppOrder}
                      className="w-full bg-[#4e6231] hover:bg-[#405227] text-white h-13 text-base font-semibold rounded-2xl shadow-sm hover:shadow transition-all duration-200"
                      disabled={!selectedVariant?.availableForSale}
                    >
                      {selectedVariant?.availableForSale
                        ? `Order on WhatsApp — ₹${(parseFloat(selectedVariant?.price.amount || "0") * quantity).toFixed(0)}`
                        : 'Out of Stock'}
                    </Button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={handleAddToCart}
                        className="w-full bg-[#4e6231] hover:bg-[#405227] text-white h-13 text-base font-semibold rounded-2xl shadow-sm hover:shadow transition-all duration-200"
                        disabled={!selectedVariant?.availableForSale}
                      >
                        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        variant="outline"
                        className="w-full border-2 border-[#4e6231] text-[#4e6231] hover:bg-[#4e6231]/10 h-13 text-base font-semibold rounded-2xl transition-all duration-200"
                        disabled={!selectedVariant?.availableForSale || isCheckingOut}
                      >
                        {isCheckingOut ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Buy Now'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Micro Trust Line Under Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-[#707c65] font-normal text-center pt-1">
                    <span>✓ Secure checkout</span>
                    <span>✓ Supports cow rescue</span>
                  </div>
                </div>

                {/* Aarambh Exclusive Add-On Callout if relevant */}
                {product.handle === "aarambh-the-starter-collection-incense-sticks-by-aurora-stomatal-farms" && (
                  <div className="p-4 rounded-2xl bg-[#fff9ed] border border-[#d4af37]/30 space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#9e7600]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span>Exclusive Order Add-On — ₹99 (3 Sacred Scents)</span>
                    </div>
                    <p className="text-xs text-[#6a7462] leading-relaxed">
                      The Aarambh Starter Set features 3 sacred scents (Dasangam, Floral, Lemongrass) and is crafted as an add-on to ride alongside any full-sized pack or combo order.
                    </p>
                  </div>
                )}

                {/* Dropdowns / Collapsible Details Section */}
                <div className="pt-4 border-t border-[#edf1e7] space-y-1">
                  <Accordion
                    type="multiple"
                    defaultValue={["description", "combo-includes"]}
                    className="w-full"
                  >
                    {/* 1. Product Description Dropdown */}
                    {(overview || description) && (
                      <AccordionItem value="description" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-[#4e6231]" />
                            <span>Product Description</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1 text-[#434e3a]">
                          {overviewUsesProductHtml && descriptionHtml ? (
                            <div
                              className="leading-relaxed text-sm space-y-2.5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />
                          ) : (
                            <div className="leading-relaxed text-sm whitespace-pre-line">
                              {overview || description}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 2. What's Inside / This Combo Includes */}
                    {comboIncludes && (
                      <AccordionItem value="combo-includes" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Package className="w-4 h-4 text-[#4e6231]" />
                            <span>{isCombo ? "This Combo Includes" : "What's Inside"}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={comboIncludes} icon={Package} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 3. Key Highlights */}
                    {keyHighlights && (
                      <AccordionItem value="highlights" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#4e6231]" />
                            <span>Key Highlights</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={keyHighlights} icon={Sparkles} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 4. Ingredients & Aroma */}
                    {ingredients && (
                      <AccordionItem value="ingredients" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Leaf className="w-4 h-4 text-[#4e6231]" />
                            <span>Ingredients & Aroma</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={ingredients} icon={Leaf} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 5. How to Use */}
                    {howToUse && (
                      <AccordionItem value="how-to-use" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <HelpCircle className="w-4 h-4 text-[#4e6231]" />
                            <span>How to Use</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={howToUse} isSteps />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 6. Nutritional Focus */}
                    {nutritionalFocus && (
                      <AccordionItem value="nutritional-focus" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Shield className="w-4 h-4 text-[#4e6231]" />
                            <span>Nutritional Focus</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={nutritionalFocus} icon={Leaf} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 7. Safety & Care */}
                    {safetyString && (
                      <AccordionItem value="safety-care" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Shield className="w-4 h-4 text-[#4e6231]" />
                            <span>Safety & Care</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={safetyString} isDetails />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 8. Product Specifications */}
                    {details && (
                      <AccordionItem value="details" className="border-b border-[#edf1e7]">
                        <AccordionTrigger className="text-[15px] font-semibold text-[#27321e] hover:no-underline py-3.5 group">
                          <div className="flex items-center gap-2.5">
                            <Info className="w-4 h-4 text-[#4e6231]" />
                            <span>Product Specifications</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <FormatMetafieldText text={details} isDetails />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </div>
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

