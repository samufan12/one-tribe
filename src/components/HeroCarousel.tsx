import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import landingDress from "@/assets/landing-dress.jpg";
import landingCoffee from "@/assets/landing-coffee.jpg";
import landingGabi from "@/assets/landing-gabi.jpg";

interface Slide {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    subtitle: "The Global Habesha Marketplace",
    title: "Shop the diaspora.",
    description: "Authentic goods. Curated by community.",
    cta: "Shop now",
    href: "/marketplace",
    image: landingDress,
  },
  {
    id: 2,
    subtitle: "Connecting communities worldwide",
    title: "Ethiopian. Eritrean.",
    description: "One marketplace. One tribe.",
    cta: "Explore",
    href: "/marketplace",
    image: landingGabi,
  },
  {
    id: 3,
    subtitle: "From our homes to yours",
    title: "Authentic Habesha goods.",
    description: "Coffee, textiles, and craft from trusted sellers.",
    cta: "Discover",
    href: "/marketplace?category=coffee",
    image: landingCoffee,
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="px-4 sm:px-6 pt-4">
      <div className="relative w-full max-w-[1400px] mx-auto h-[460px] md:h-[600px] overflow-hidden bg-secondary rounded-[28px] shadow-soft-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-spring ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-16 md:pb-20">
              <p className="text-eyebrow text-white/90 mb-3">
                {slide.subtitle}
              </p>
              <h2 className="text-display text-white mb-3 max-w-3xl">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl font-normal">
                {slide.description}
              </p>
              <button
                onClick={() => navigate(slide.href)}
                className="px-7 py-3 bg-white text-foreground font-medium text-sm rounded-full hover:bg-white/90 active:scale-[0.98] transition-all duration-200 ease-spring shadow-soft"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ease-spring ${
                index === currentSlide ? "bg-white w-6" : "bg-white/40 w-1.5 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
