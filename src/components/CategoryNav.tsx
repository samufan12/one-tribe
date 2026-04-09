import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { featureFlags } from "@/config/featureFlags";

interface CategoryItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  items?: { label: string; href: string; flag?: boolean }[];
  flag?: boolean;
}

const allCategories: CategoryItem[] = [
  { 
    label: "TRADITIONAL WEAR", 
    href: "/marketplace?category=traditional",
    hasDropdown: true,
    items: [
      { label: "Kemis & Dresses", href: "/marketplace?category=kemis", flag: featureFlags.showTraditionalWearKemis },
      { label: "Netela & Shawls", href: "/marketplace?category=netela", flag: featureFlags.showTraditionalWearNetela },
      { label: "Men's Traditional", href: "/marketplace?category=mens", flag: featureFlags.showTraditionalWearMens },
    ]
  },
  { 
    label: "HOME & DECOR", 
    href: "/marketplace?category=home",
    hasDropdown: true,
    flag: featureFlags.showCategoryHomeDecor,
    items: [
      { label: "Coffee Sets", href: "/marketplace?category=coffee" },
      { label: "Baskets", href: "/marketplace?category=baskets" },
      { label: "Textiles", href: "/marketplace?category=textiles" },
    ]
  },
  { 
    label: "JEWELRY", 
    href: "/marketplace?category=jewelry",
    hasDropdown: true,
    flag: featureFlags.showCategoryJewelry,
    items: [
      { label: "Necklaces", href: "/marketplace?category=necklaces" },
      { label: "Bracelets", href: "/marketplace?category=bracelets" },
      { label: "Earrings", href: "/marketplace?category=earrings" },
    ]
  },
  { label: "ART", href: "/marketplace?category=art", flag: featureFlags.showCategoryArt },
  { label: "COMMUNITY PICKS", href: "/marketplace?featured=true", flag: featureFlags.showCategoryCommunityPicks },
  { label: "COLLECTIONS", href: "/categories", flag: featureFlags.showCategoryCollections },
  { label: "CULTURAL GUIDE", href: "/cultural-guide", flag: featureFlags.showCategoryCulturalGuide },
];

const categories = allCategories
  .filter((c) => c.flag !== false)
  .map((c) => ({
    ...c,
    items: c.items?.filter((i) => i.flag !== false),
  }));

const CategoryNav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category: CategoryItem) => {
    if (category.hasDropdown) {
      setOpenDropdown(openDropdown === category.label ? null : category.label);
    } else {
      navigate(category.href);
    }
  };

  return (
    <nav className="bg-background border-b border-border overflow-x-auto">
      <div className="max-w-[1400px] mx-auto px-4">
        <ul className="flex items-center justify-center gap-0 min-w-max">
          {categories.map((category) => (
            <li key={category.label} className="relative group">
              <button
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => category.hasDropdown && setOpenDropdown(category.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap"
              >
                {category.label}
                {category.hasDropdown && <ChevronDown size={14} />}
              </button>
              
              {/* Dropdown */}
              {category.hasDropdown && openDropdown === category.label && (
                <div 
                  className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-md py-2 min-w-[180px] z-50"
                  onMouseEnter={() => setOpenDropdown(category.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {category.items?.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.href); setOpenDropdown(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => { navigate(category.href); setOpenDropdown(null); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    View All
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;
