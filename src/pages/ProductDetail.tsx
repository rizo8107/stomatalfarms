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
import { ChevronLeft, Loader2, Minus, Plus, ShoppingBag, Truck, Leaf, Shield, Award } from "lucide-react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
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
    overview = cleanText.substring(0, 300).trim();
    if (cleanText.length > 300) overview += "...";
  }
  
  return { overview, ingredients, howToUse, details, comboIncludes };
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
  const { overview, ingredients, howToUse, details, comboIncludes } = parseDescriptionSections(description);

  // Determine default expanded items
  const defaultAccordionValue = [];
  if (comboIncludes) defaultAccordionValue.push("combo-includes");
  if (ingredients) defaultAccordionValue.push("ingredients");
  if (howToUse) defaultAccordionValue.push("how-to-use");
  if (details) defaultAccordionValue.push("details");

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
      position: "top-center",
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

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-3 md:space-y-4">
              <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-sage-light/30 border border-border shadow-sm">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-contain md:object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.slice(0, 6).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === index 
                          ? 'border-[#8dcc5b] shadow-md' 
                          : 'border-border hover:border-[#8dcc5b]/40'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="font-serif text-xl md:text-3xl lg:text-4xl text-foreground mb-2 md:mb-3 leading-tight break-words">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl md:text-3xl font-bold text-[#8dcc5b]">
                    ₹{parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
                  </p>
                  {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <p className="text-lg text-muted-foreground line-through">
                      ₹{parseFloat(selectedVariant.compareAtPrice.amount).toFixed(0)}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Overview */}
              {overview && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {overview}
                  </p>
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
                        <p className="whitespace-pre-line">{comboIncludes}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {ingredients && (
                    <AccordionItem value="ingredients" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        Ingredients
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <p>{ingredients}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {howToUse && (
                    <AccordionItem value="how-to-use" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        How to Use
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <div className="space-y-2">
                          {howToUse.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <div key={idx} className="flex gap-3">
                              <span className="text-[#8dcc5b] font-bold flex-shrink-0">•</span>
                              <span className="flex-1">{line.replace(/^[•-]\s*/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {details && (
                    <AccordionItem value="details" className="border border-border rounded-lg bg-card/50 px-4 data-[state=open]:bg-card transition-colors">
                      <AccordionTrigger className="text-base font-medium py-4 hover:no-underline text-foreground">
                        Product Details
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        <div className="space-y-3">
                          {details.split('\n\n').filter(line => line.trim()).map((line, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-[#8dcc5b] font-bold flex-shrink-0 mt-1.5">•</span>
                              <span className="flex-1 leading-relaxed">{line.replace(/^[•\-*]\s*/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
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
                            className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                              selectedVariant?.selectedOptions.some(
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
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                )}
              </div>

              {/* Trust Badges / Delivery Info */}
              {isMicrogreens ? (
                <div className="pt-6 border-t border-border">
                  <div className="bg-[#8dcc5b]/10 border-2 border-[#8dcc5b] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="h-6 w-6 text-[#8dcc5b] flex-shrink-0 mt-0.5" />
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
                    <Truck className="h-5 w-5 text-[#8dcc5b] flex-shrink-0" />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <Leaf className="h-5 w-5 text-[#8dcc5b] flex-shrink-0" />
                    <span className="font-medium">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <Shield className="h-5 w-5 text-[#8dcc5b] flex-shrink-0" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground bg-sage-light/20 rounded-lg p-3">
                    <Award className="h-5 w-5 text-[#8dcc5b] flex-shrink-0" />
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
              <ShoppingBag className="h-4 w-4 mr-2" />
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
