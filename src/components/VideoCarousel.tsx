import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const videos = [
  "https://cdn.shopify.com/videos/c/o/v/b7cb1c7e761146b396382bfca162dedd.mp4",
  "https://cdn.shopify.com/videos/c/o/v/b4c6bb109167438ab8591eafd15eab07.mp4",
  "https://cdn.shopify.com/videos/c/o/v/4cab5995a53549b3b402e5b226451fcb.mp4",
  "https://cdn.shopify.com/videos/c/o/v/e8bf46f5f2094abe9bc7a9a7dd431e67.mp4",
  "https://cdn.shopify.com/videos/c/o/v/1020d997526540b8b8b41fbfbbe65165.mp4",
  "https://cdn.shopify.com/videos/c/o/v/01fecbcfa26a474b8c1914223d31b60e.mp4",
  "https://cdn.shopify.com/videos/c/o/v/90108b258cb74d3bb3d759f5c0ed7791.mp4",
];

// Muted preview slide — pauses when not active
const VideoSlide = ({ src, active, onClick }: { src: string; active: boolean; onClick: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => { });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <div className="relative w-full h-full cursor-pointer group/slide" onClick={onClick}>
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
          <Play className="w-6 h-6 text-[#1a2416] ml-1" fill="#1a2416" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

// Full-screen popup player with audio
const VideoPopup = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play().catch(() => { });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm md:max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={ref}
          src={src}
          className="w-full rounded-2xl shadow-2xl"
          controls
          playsInline
          autoPlay
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-[#1a2416]" />
        </button>
      </div>
    </div>
  );
};

export const VideoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [popupSrc, setPopupSrc] = useState<string | null>(null);

  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <>
      <section className="py-16 md:py-24 px-4 bg-[#1a2416] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a8c690] flex items-center gap-2 mb-2">
                <span className="w-6 h-px bg-[#a8c690]/40" />
                From Aurora
              </p>
              <h2
                className="text-2xl md:text-4xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                See it in{" "}
                <span className="italic text-[#a8c690]">real life.</span>
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3 md:gap-4">
                {videos.map((src, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_72%] sm:flex-[0_0_50%] md:flex-[0_0_36%] lg:flex-[0_0_28%] min-w-0"
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5">
                      <VideoSlide
                        src={src}
                        active={activeIndex === i}
                        onClick={() => setPopupSrc(src)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile arrows */}
            <button
              onClick={scrollPrev}
              className="md:hidden absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="md:hidden absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${activeIndex === i
                  ? "w-6 h-1.5 bg-[#a8c690]"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  }`}
              />
            ))}
          </div>

          <p className="text-center text-xs text-white/30 mt-4">Tap a video to watch with sound</p>
        </div>
      </section>

      {/* Popup player */}
      {popupSrc && <VideoPopup src={popupSrc} onClose={() => setPopupSrc(null)} />}
    </>
  );
};
