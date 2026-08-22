import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import { GoogleReviewsCarousel } from "@/components/GoogleReviewsCarousel";
import AuroraComparison from "@/components/AuroraComparison";
import ProductsSection from "@/components/ProductsSection";
import { BundleCarousel } from "@/components/BundleCarousel";
import { VideoCarousel } from "@/components/VideoCarousel";
import GreensSection from "@/components/GreensSection";
import WhyUs from "@/components/WhyUs";
import FAQ from "@/components/FAQ";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import OfferPopup from "@/components/OfferPopup";
import SEO from "@/components/SEO";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f7f1e8" }}>
      <SEO
        title="Stomatal Farms | Aurora Aromatic Wellness Products"
        description="Authentic aromatic wellness products crafted from traditional Indian herbs, pure cow dung, and essential oils. Natural incense sticks, cups, and ghee lamps."
        url="/"
      />
      <Header />
      <main>
        {/* 1. Hero */}
        <HeroSection />
        <SocialProofBar />

        {/* 2. Google Reviews */}
        <GoogleReviewsCarousel />
        <AuroraComparison />

        {/* 3. Bundle carousel */}
        <BundleCarousel />

        {/* 4. Aurora Collection grid */}
        <ProductsSection />

        <GreensSection />

        {/* 5. Video */}
        <VideoCarousel />

        <WhyUs />
        <FAQ />
        <InstagramCarousel />
        <FinalCTA />
      </main>
      <Footer />
      <OfferPopup />
    </div>
  );
};

export default Index;
