import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Sparkles, RefreshCw, AlertCircle, Mail } from "lucide-react";

const ReturnsRefunds = () => {
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
                Customer Care & Commitments
              </span>
              <h1 
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                Returns & Refunds
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                At Aurora, every product is handcrafted in small batches with care and intention. Learn more about our policies and how we guarantee the quality of our creations.
              </p>
            </div>
          </section>

          {/* Main Content Layout */}
          <div className="container py-16">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Introduction Card */}
              <div 
                className="p-8 md:p-10 rounded-3xl border border-border/80 relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(244,247,243,0.4) 100%)",
                  backdropFilter: "blur(8px)"
                }}
              >
                <div className="flex gap-4 items-start md:items-center">
                  <div className="p-3 bg-[#5a8739]/10 rounded-2xl text-[#5a8739] shrink-0">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Handcrafted with Care
                    </h2>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      Because our products are consumables made for personal wellness, we are unable to accept returns on opened or used items. That said, we stand fully behind the quality of what we make.
                    </p>
                  </div>
                </div>
              </div>

              {/* The "We'll Make It Right" section */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  We’ll Make It Right If:
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      num: "1",
                      title: "Transit Damage",
                      desc: "Your order arrived damaged in transit."
                    },
                    {
                      num: "2",
                      title: "Incorrect Order",
                      desc: "You received the wrong product."
                    },
                    {
                      num: "3",
                      title: "Manufacturing Defect",
                      desc: "Your product has a manufacturing defect (e.g. a broken diya)."
                    }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5a8739]/15 text-[#5a8739] flex items-center justify-center font-bold text-sm mb-4">
                        {item.num}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl border border-[#5a8739]/20 bg-[#5a8739]/5 mt-6">
                  <p className="text-sm text-foreground leading-relaxed font-light flex flex-col md:flex-row md:items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#5a8739]">
                      <ShieldCheck className="w-5 h-5 shrink-0" /> How to claim:
                    </span>
                    <span>
                      Simply write to us at <a href="mailto:contact@stomatalfarms.com" className="font-semibold underline hover:text-[#5a8739] transition-colors">contact@stomatalfarms.com</a> within <strong>48 hours of delivery</strong> with your order number and a clear photo of the issue. We’ll arrange a replacement or store credit promptly.
                    </span>
                  </p>
                </div>
              </div>

              {/* Policy notes list */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#c47c32]" />
                  <h2 className="font-serif text-3xl text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Please Note
                  </h2>
                </div>
                
                <ul className="grid gap-4">
                  {[
                    "Claims raised after 48 hours of delivery cannot be processed.",
                    "We do not offer cash refunds — replacements or store credit only.",
                    "Products that have been opened, used, or partially consumed are not eligible for return.",
                    "Return shipping costs are borne by the customer unless the error was ours.",
                    "Sampler packs and discounted items are non-refundable."
                  ].map((note, idx) => (
                    <li 
                      key={idx}
                      className="flex gap-4 items-start text-muted-foreground text-base font-light leading-relaxed p-4 rounded-xl hover:bg-[#f7f1e8]/30 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#f7f1e8] text-foreground flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Still Unhappy Section */}
              <div 
                className="p-8 rounded-3xl text-center border border-border shadow-sm"
                style={{ background: "rgba(90, 135, 57, 0.03)" }}
              >
                <h2 className="font-serif text-2xl text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Not happy for any other reason?
                </h2>
                <p className="text-muted-foreground font-light max-w-xl mx-auto mb-6 leading-relaxed text-sm md:text-base">
                  If something felt off about your experience, we’d genuinely like to hear from you. Write to us and we’ll do our best to help. Aurora is built on trust, and your satisfaction matters to us.
                </p>
                <a 
                  href="mailto:contact@stomatalfarms.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-[#5a8739] hover:bg-[#5a8739]/90 font-medium text-sm transition-all shadow-sm active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  contact@stomatalfarms.com
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnsRefunds;
