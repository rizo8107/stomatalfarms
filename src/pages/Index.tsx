import { useEffect } from "react";
import Header from "@/components/Header";
import IntroSection from "@/components/IntroSection";
import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import ProductsSection from "@/components/ProductsSection";
import RitualsSection from "@/components/RitualsSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background texture-overlay">
      <Header />
      <main>
        <IntroSection />
        <HeroSection />
        <ProductCategories />
        <ProductsSection />
        <RitualsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
