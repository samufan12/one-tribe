import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import seller1 from "@/assets/seller-1.jpg";
import seller2 from "@/assets/seller-2.jpg";
import seller3 from "@/assets/seller-3.jpg";
import person1 from "@/assets/person-1.jpg";
import person2 from "@/assets/person-2.jpg";

const sellers = [
  {
    id: 1,
    name: "Abeba's Boutique",
    image: seller1,
    rating: 4.9,
    reviews: 234,
    items: 48,
    specialty: "Ethiopian Kemis",
    location: "Washington, DC",
  },
  {
    id: 2,
    name: "Asmara Threads",
    image: seller2,
    rating: 4.8,
    reviews: 189,
    items: 62,
    specialty: "Eritrean Zuria",
    location: "London, UK",
  },
  {
    id: 3,
    name: "Mogadishu Crafts",
    image: seller3,
    rating: 4.9,
    reviews: 312,
    items: 85,
    specialty: "Somali Dirac",
    location: "Minneapolis, MN",
  },
  {
    id: 4,
    name: "Nairobi Designs",
    image: person1,
    rating: 4.7,
    reviews: 156,
    items: 37,
    specialty: "Kenyan Kikoy",
    location: "Atlanta, GA",
  },
  {
    id: 5,
    name: "Habesha Home",
    image: person2,
    rating: 4.8,
    reviews: 201,
    items: 54,
    specialty: "Coffee & Decor",
    location: "Amsterdam, NL",
  },
];

const TopSellers = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 bg-background">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide">Top Sellers</h2>
          <button 
            onClick={() => navigate('/marketplace?filter=top-sellers')}
            className="text-xs font-medium uppercase tracking-wider hover:underline"
          >
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              onClick={() => navigate(`/marketplace?seller=${seller.id}`)}
              className="group cursor-pointer text-center"
            >
              <div className="relative mb-3">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors truncate px-2">
                {seller.name}
              </h3>
              
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs font-medium">{seller.rating}</span>
                <span className="text-xs text-muted-foreground">({seller.reviews})</span>
              </div>
              
              <p className="text-xs text-muted-foreground">{seller.specialty}</p>
              <p className="text-xs text-muted-foreground">{seller.location}</p>
              <p className="text-xs text-muted-foreground">{seller.items} items</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
