import GrailedLayout from "@/components/GrailedLayout";
import FindItForMe from "@/components/FindItForMe";

const AssistantPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <FindItForMe />
      </div>
    </GrailedLayout>
  );
};

export default AssistantPage;
