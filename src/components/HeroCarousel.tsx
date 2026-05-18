import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landingDress from "@/assets/landing-dress.jpg";
import landingCoffee from "@/assets/landing-coffee.jpg";
import landingGabi from "@/assets/landing-gabi.jpg";

interface Slide {
  id: number; eyebrow: string; title: string; italic: string; description: string;
  cta: string; href: string; image: string;
}

const slides: Slide[] = [
  { id: 1, eyebrow: "Vol. 01 — The Marketplace", title: "Shop the", italic: "diaspora.", description: "Authentic goods from trusted sellers across the world.", cta: "Enter the marketplace", href: "/marketplace", image: landingDress },
  { id: 2, eyebrow: "Vol. 02 — One Tribe", title: "Ethiopian.", italic: "Eritrean.", description: "One marketplace, woven from many threads.", cta: "Browse the collection", href: "/marketplace", image: landingGabi },
  { id: 3, eyebrow: "Vol. 03 — From our home", title: "Coffee, textiles,", italic: "ceremony.", description: "Pieces with provenance, listed by hand.", cta: "Discover", href: "/marketplace?category=coffee", image: landingCoffee },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative">
      <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-secondary">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-spring ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div
              className="absolute inset-0 bg-cover"
              style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: "center 25%", transform: i === current ? "scale(1.04)" : "scale(1)", transition: "transform 7s ease-out" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />

            <div className="relative h-full max-w-[1600px] mx-auto px-6 sm:px-10 flex flex-col justify-end pb-20 md:pb-28">
              <p className="text-eyebrow text-white/80 mb-5">{slide.eyebrow}</p>
              <h1
                className="text-white font-semibold tracking-[-0.04em] leading-[0.95] max-w-5xl"
                style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
              >
                {slide.title} <span className="italic font-light">{slide.italic}</span>
              </h1>
              <p className="mt-6 text-white/80 text-base md:text-lg max-w-md leading-relaxed">
                {slide.description}
              </p>
              <div className="mt-10 flex items-center gap-6">
                <button
                  onClick={() => navigate(slide.href)}
                  className="px-7 h-12 bg-white text-foreground text-sm font-medium rounded-full hover:bg-white/90 active:scale-[0.98] transition-all duration-200 ease-spring"
                >
                  {slide.cta}
                </button>
                <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 tabular-nums">
                  {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators — minimal */}
        <div className="absolute bottom-10 right-6 sm:right-10 flex items-center gap-1 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-px transition-all duration-500 ease-spring ${i === current ? "bg-white w-12" : "bg-white/40 w-6 hover:bg-white/70"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
