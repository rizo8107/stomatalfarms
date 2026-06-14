import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />
        <main className="pt-20 md:pt-28 pb-16">
          {/* Hero Header */}
          <section className="py-16 bg-sage-light/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"https://www.transparenttextures.com/patterns/p6.png\")" }}></div>
            <div className="container text-center relative z-10">
              <span className="text-[#5a8739] text-xs uppercase tracking-[0.3em] mb-4 block font-semibold">
                Legal & Governance
              </span>
              <h1 
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Welcome to Stomatal Farms. Please read these terms carefully before using our website or purchasing our Aurora products.
              </p>
            </div>
          </section>

          {/* Policy content */}
          <div className="container py-16">
            <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert space-y-12">
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  By accessing this website, purchasing Aurora wellness products, or interacting with our services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  2. Handcrafted Wellness Products
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  All Aurora products (including incense sticks, cups, ghee lamps, and bath salts) are handcrafted in small batches with natural ingredients and organic elements. Minor variations in color, texture, and aroma are inherent in handcrafted items and should be expected rather than viewed as defects.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  3. Pricing & Billing
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  All prices are displayed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to refuse or cancel orders due to pricing inaccuracies or stock limitations. Transactions are processed securely via our checkout system.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  4. Shipping & Delivery
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  We strive to dispatch orders within 3 to 5 working days. While we use reliable shipping partners, transit times may vary depending on locations. Stomatal Farms is not responsible for delays caused by logistics companies or force majeure events.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  5. Governing Law
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of your use of this site or purchases made through it shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
                </p>
              </section>

              <div className="pt-6 border-t border-border/80">
                <p className="text-sm text-muted-foreground font-light italic">
                  Last Updated: May 2026. For questions regarding these terms, contact us at contact@stomatalfarms.com.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
