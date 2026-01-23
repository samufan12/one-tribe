import GrailedLayout from "@/components/GrailedLayout";
import { Categories as CategoriesComponent } from "@/components/Categories";

const CategoriesPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <CategoriesComponent />
      </div>
    </GrailedLayout>
  );
};

export default CategoriesPage;
