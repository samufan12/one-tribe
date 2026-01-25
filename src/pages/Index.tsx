import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import HeroCarousel from "@/components/HeroCarousel";
import ProductSection from "@/components/ProductSection";
import TopSellers from "@/components/TopSellers";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <GrailedLayout>
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Top Sellers */}
      <TopSellers />
      
      {/* Product Sections */}
      <ProductSection title="Daily Picks For You" />
      <ProductSection title="Trending Now" seeMoreHref="/marketplace?sort=trending" />
      <ProductSection title="New Arrivals" seeMoreHref="/marketplace?sort=newest" />
      
      {/* Community Banner */}
      <section className="py-12 bg-muted">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">The East African Marketplace</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connecting the Ethiopian, Eritrean, Somali, and Kenyan diaspora with authentic goods from home. 
            Shop traditional clothing, handcrafted items, and cultural treasures from trusted sellers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-foreground text-background font-medium rounded hover:bg-foreground/90 transition-colors"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 border border-foreground text-foreground font-medium rounded hover:bg-foreground hover:text-background transition-colors"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </section>
    </GrailedLayout>
  );
};

export default Index;
