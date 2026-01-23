import GrailedLayout from "@/components/GrailedLayout";
import { StyleGuide as StyleGuideComponent } from "@/components/StyleGuide";

const StyleGuidePage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <StyleGuideComponent />
      </div>
    </GrailedLayout>
  );
};

export default StyleGuidePage;
