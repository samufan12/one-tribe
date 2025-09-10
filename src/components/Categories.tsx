import { Package, Palette, Coffee, Gem, Music, Brush } from "lucide-react";
import kemis1 from "@/assets/kemis-1.jpg";
import kemis2 from "@/assets/kemis-2.jpg";
import coffeeSet from "@/assets/coffee-set.jpg";
import seller1 from "@/assets/seller-1.jpg";

const categories = [
  {
    name: "Traditional Wear",
    icon: Package,
    count: 248,
    description: "Authentic kemis, habesha dresses, and cultural attire",
    color: "bg-blue-500"
  },
  {
    name: "Jewelry & Accessories",
    icon: Gem,
    count: 156,
    description: "Traditional jewelry, scarves, and cultural accessories",
    color: "bg-purple-500"
  },
  {
    name: "Home & Decor",
    icon: Coffee,
    count: 89,
    description: "Coffee sets, decorative items, and home furnishings",
    color: "bg-green-500"
  },
  {
    name: "Art & Crafts",
    icon: Brush,
    count: 73,
    description: "Handwoven items, paintings, and traditional crafts",
    color: "bg-orange-500"
  },
  {
    name: "Music & Instruments",
    icon: Music,
    count: 42,
    description: "Traditional instruments and cultural music items",
    color: "bg-pink-500"
  },
  {
    name: "Vintage & Collectibles",
    icon: Palette,
    count: 61,
    description: "Rare finds and vintage cultural items",
    color: "bg-indigo-500"
  }
];

export const Categories = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Explore items by category to find exactly what you're looking for
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-card rounded-lg border p-6 hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} items</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Popular Items */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular This Week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors">
            <div className="w-full h-48 overflow-hidden">
              <img src={kemis1} alt="Traditional Habesha Kemis" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Traditional Habesha Kemis</h4>
              <p className="text-sm text-muted-foreground mb-2">Traditional Wear</p>
              <p className="font-semibold text-primary">$240</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors">
            <div className="w-full h-48 overflow-hidden">
              <img src={kemis2} alt="Elegant Cultural Dress" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Elegant Cultural Dress</h4>
              <p className="text-sm text-muted-foreground mb-2">Traditional Wear</p>
              <p className="font-semibold text-primary">$185</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors">
            <div className="w-full h-48 overflow-hidden">
              <img src={coffeeSet} alt="Coffee Ceremony Set" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Coffee Ceremony Set</h4>
              <p className="text-sm text-muted-foreground mb-2">Home & Decor</p>
              <p className="font-semibold text-primary">$85</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border overflow-hidden hover:border-primary/50 transition-colors">
            <div className="w-full h-48 overflow-hidden">
              <img src={seller1} alt="Traditional Jewelry" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Traditional Jewelry Set</h4>
              <p className="text-sm text-muted-foreground mb-2">Jewelry & Accessories</p>
              <p className="font-semibold text-primary">$125</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};