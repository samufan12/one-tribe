import GrailedLayout from "@/components/GrailedLayout";
import { Marketplace as MarketplaceComponent } from "@/components/Marketplace";

const MarketplacePage = () => {
  return (
    <GrailedLayout showCategoryNav={false}>
      <MarketplaceComponent />
    </GrailedLayout>
  );
};

export default MarketplacePage;
