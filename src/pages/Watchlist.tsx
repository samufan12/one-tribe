import GrailedLayout from "@/components/GrailedLayout";
import { Watchlist as WatchlistComponent } from "@/components/Watchlist";

const WatchlistPage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <WatchlistComponent />
      </div>
    </GrailedLayout>
  );
};

export default WatchlistPage;
