import GrailedLayout from "@/components/GrailedLayout";
import { SellItem as SellItemComponent } from "@/components/SellItem";

const SellItemPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <SellItemComponent />
      </div>
    </GrailedLayout>
  );
};

export default SellItemPage;
