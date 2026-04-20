import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sellers = [
  { id: 1, name: "Abeba's Boutique", initials: "AB", rating: 4.9, reviews: 234, items: 48, specialty: "Ethiopian Kemis", location: "Washington, DC" },
  { id: 2, name: "Asmara Threads", initials: "AT", rating: 4.8, reviews: 189, items: 62, specialty: "Eritrean Zuria", location: "London, UK" },
  { id: 3, name: "Tigray Textiles", initials: "TT", rating: 4.9, reviews: 312, items: 85, specialty: "Traditional Tilf", location: "Minneapolis, MN" },
  { id: 4, name: "Addis Collections", initials: "AC", rating: 4.7, reviews: 156, items: 37, specialty: "Modern Habesha", location: "Atlanta, GA" },
  { id: 5, name: "Habesha Home", initials: "HH", rating: 4.8, reviews: 201, items: 54, specialty: "Coffee & Decor", location: "Amsterdam, NL" },
];

const tints = [
  "bg-[hsl(138,40%,90%)] text-[hsl(138,91%,22%)]",
  "bg-[hsl(40,80%,92%)] text-[hsl(35,70%,30%)]",
  "bg-[hsl(220,40%,92%)] text-[hsl(220,40%,30%)]",
  "bg-[hsl(0,40%,92%)] text-[hsl(0,60%,35%)]",
  "bg-[hsl(280,30%,92%)] text-[hsl(280,40%,35%)]",
];

const TopSellers = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Top sellers</h2>
          <button
            onClick={() => navigate('/marketplace?filter=top-sellers')}
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sellers.map((seller, idx) => (
            <button
              key={seller.id}
              onClick={() => navigate(`/marketplace?seller=${seller.id}`)}
              className="group bg-card rounded-2xl p-5 text-center hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-spring border border-border/50"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${tints[idx % tints.length]}`}>
                <span className="font-semibold text-lg tracking-tight">{seller.initials}</span>
              </div>

              <h3 className="font-medium text-sm mb-1 truncate">{seller.name}</h3>

              <div className="flex items-center justify-center gap-1 mb-1.5">
                <Star className="w-3 h-3 fill-foreground text-foreground" />
                <span className="text-xs font-medium">{seller.rating}</span>
                <span className="text-xs text-muted-foreground">({seller.reviews})</span>
              </div>

              <p className="text-xs text-muted-foreground truncate">{seller.specialty}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{seller.location}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
