import GrailedLayout from "@/components/GrailedLayout";
import { SizeCharts as SizeChartsComponent } from "@/components/SizeCharts";

const SizeChartsPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <SizeChartsComponent />
      </div>
    </GrailedLayout>
  );
};

export default SizeChartsPage;
