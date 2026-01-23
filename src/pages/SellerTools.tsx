import GrailedLayout from "@/components/GrailedLayout";
import { SellerTools as SellerToolsComponent } from "@/components/SellerTools";

const SellerToolsPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <SellerToolsComponent />
      </div>
    </GrailedLayout>
  );
};

export default SellerToolsPage;
