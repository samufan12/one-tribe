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

    </GrailedLayout>
  );
};

export default Index;
