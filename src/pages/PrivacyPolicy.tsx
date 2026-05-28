import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Your trust and privacy are fundamental to us. Here is how we handle, protect, and respect your personal information.
              </p>
            </div>
          </section>

          {/* Policy content */}
          <div className="container py-16">
            <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert space-y-12">
              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  When you purchase from Stomatal Farms or sign up for our Ritual List, we collect the personal information you give us (such as name, email address, physical address, and phone number). We also collect diagnostic info via cookies and tracking tools to optimize your website experience.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  2. Consent & Consent Withdrawal
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  When you provide details to complete a transaction, verify your credit card, or place an order, we imply that you consent to our collecting it and using it for that specific reason only. If we ask for your information for marketing purposes, we will ask you directly or give you an option to opt out.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  3. Cookies and Analytics
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  We use cookies and third-party tools (such as Google Analytics, Microsoft Clarity, and Meta Pixels) to analyze website traffic, run ads, and tailor user journeys. You can modify your browser settings to decline cookies if you prefer.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  4. Third-Party Services
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  In general, the third-party providers used by us will only collect, use, and disclose your information to the extent necessary to allow them to perform the services they provide to us. However, certain payment gateways and transaction processors have their own privacy policies. We recommend reading their policies to understand how your data is handled.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  5. Security
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed">
                  To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
                </p>
              </section>

              <div className="pt-6 border-t border-border/80">
                <p className="text-sm text-muted-foreground font-light italic">
                  Last Updated: May 2026. For privacy concerns or data requests, contact us at contact@stomatalfarms.com.
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

export default PrivacyPolicy;
