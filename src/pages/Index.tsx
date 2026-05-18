import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import HeroCarousel from "@/components/HeroCarousel";
import ProductSection from "@/components/ProductSection";
import TopSellers from "@/components/TopSellers";
import RecentlyViewed from "@/components/RecentlyViewed";


const Index = () => {
  const navigate = useNavigate();

  return (
    <GrailedLayout>
      <HeroCarousel />
      <RecentlyViewed />
      <TopSellers />
      <ProductSection
        chapter="Chapter 01 — Daily edit"
        title="Picked for you, today."
        intro="A small selection from the global tribe, refreshed every morning."
      />
      <ProductSection
        chapter="Chapter 02 — In motion"
        title="What the tribe is loving."
        intro="The pieces being saved, shared, and shipped this week."
        seeMoreHref="/marketplace?sort=trending"
      />
      <ProductSection
        chapter="Chapter 03 — Fresh from the source"
        title="Just listed."
        intro="New arrivals, hand-picked by sellers across the diaspora."
        seeMoreHref="/marketplace?sort=newest"
      />

      {/* Editorial CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto bg-foreground text-background rounded-[28px] px-8 py-16 md:py-24 text-center shadow-soft-xl">
          <p className="text-eyebrow text-background/60 mb-4">The Global Habesha Marketplace</p>
          <h2 className="text-display mb-5 max-w-3xl mx-auto">
            Home, delivered.
          </h2>
          <p className="text-base md:text-lg text-background/70 mb-10 max-w-xl mx-auto">
            Connecting the Ethiopian and Eritrean diaspora with authentic goods from trusted sellers across the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-7 py-3 bg-background text-foreground font-medium text-sm rounded-full hover:bg-background/90 active:scale-[0.98] transition-all duration-200 ease-spring"
            >
              Start shopping
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-7 py-3 border border-background/30 text-background font-medium text-sm rounded-full hover:bg-background/10 active:scale-[0.98] transition-all duration-200 ease-spring"
            >
              Browse listings
            </button>
          </div>
        </div>
      </section>

      <WaitlistSection />
    </GrailedLayout>
  );
};

export default Index;
