import GrailedLayout from "@/components/GrailedLayout";
import { CommunityFeed } from "@/components/CommunityFeed";

const CommunityPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <CommunityFeed />
      </div>
    </GrailedLayout>
  );
};

export default CommunityPage;
