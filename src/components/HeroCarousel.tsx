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
  cta: string;
  href: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    subtitle: "THE GLOBAL HABESHA MARKETPLACE",
    title: "Shop the Diaspora",
    cta: "SHOP NOW",
    href: "/marketplace",
    image: landingDress,
  },
  {
    id: 2,
    subtitle: "CONNECTING COMMUNITIES WORLDWIDE",
    title: "Ethiopian • Eritrean",
    cta: "EXPLORE",
    href: "/marketplace",
    image: landingGabi,
  },
  {
    id: 3,
    subtitle: "FROM OUR HOMES TO YOURS",
    title: "Authentic Habesha Goods",
    cta: "DISCOVER",
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-muted">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-sm md:text-base font-medium tracking-wider mb-2 md:mb-4">
              {slide.subtitle}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8">
              {slide.title}
            </h2>
            <button
              onClick={() => navigate(slide.href)}
              className="px-8 py-3 border-2 border-white text-white font-medium text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={40} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
