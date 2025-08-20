import { useState } from "react";
import { sidebarItems, sidebarDropdownSections } from "./sidebar/sidebarData";
import { SidebarItem } from "./sidebar/SidebarItem";
import { ModernSidebarDropdownSection } from "./sidebar/ModernSidebarDropdownSection";
import { BecomeSellerModal } from "./BecomeSellerModal";
import { useUserRole } from "@/hooks/useUserRole";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile' | 'become-seller' | 'seller-tools' | 'sell' | 'categories' | 'watchlist' | 'style-guide' | 'size-charts';

interface SidebarProps {
  activeView: ContentView;
  onNavigate: (view: ContentView) => void;
}

export const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  const [showBecomeSellerModal, setShowBecomeSellerModal] = useState(false);
  const { isSeller, loading } = useUserRole();

  const handleItemClick = (itemId: string) => {
    if (itemId === 'become-seller') {
      if (!isSeller() && !loading) {
        setShowBecomeSellerModal(true);
      }
    } else {
      onNavigate(itemId as ContentView);
    }
  };

  // Filter sidebar sections based on user role
  const filteredSections = sidebarDropdownSections.map(section => {
    if (section.title === "Selling") {
      // Show seller tools only for sellers
      return {
        ...section,
        items: section.items.filter(item => 
          item.id === "sell" || (item.id === "seller-tools" && isSeller())
        )
      };
    }
    
    if (section.title === "Account") {
      // Show "Become Seller" only for non-sellers
      return {
        ...section,
        items: section.items.filter(item => 
          item.id === "profile" || (item.id === "become-seller" && !isSeller() && !loading)
        )
      };
    }
    
    return section;
  }).filter(section => section.items.length > 0);

  return (
    <>
      <div className="w-64 bg-sidebar border-r border-border min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-semibold text-lg">OneTribe</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={<item.icon size={16} />}
                label={item.title}
                isActive={activeView === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </nav>

          <div className="mt-8 space-y-6">
            {filteredSections.map((section) => (
              <ModernSidebarDropdownSection
                key={section.title}
                section={section}
                activeView={activeView}
                onNavigate={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>
      
      <BecomeSellerModal 
        open={showBecomeSellerModal} 
        onOpenChange={setShowBecomeSellerModal} 
      />
    </>
  );
};