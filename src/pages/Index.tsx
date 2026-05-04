import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import FeaturedBundle from "@/components/FeaturedBundle";
import ProductsSection from "@/components/ProductsSection";
import HowToUse from "@/components/HowToUse";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f7f1e8" }}>
      <Header />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeaturedBundle />
        <ProductsSection />
        <HowToUse />
        <WhyUs />
        <Reviews />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
