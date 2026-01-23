import GrailedLayout from "@/components/GrailedLayout";
import { Assistant as AssistantComponent } from "@/components/Assistant";

const AssistantPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <AssistantComponent />
      </div>
    </GrailedLayout>
  );
};

export default AssistantPage;
