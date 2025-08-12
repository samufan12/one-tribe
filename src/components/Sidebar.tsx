
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SidebarItem } from "./sidebar/SidebarItem";
import { DropdownItem } from "./sidebar/DropdownItem";
import { SidebarDropdownSection } from "./sidebar/SidebarDropdownSection";
import { mainNavItems, myStuffItems, resourcesItems } from "./sidebar/sidebarData";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile';

interface SidebarProps {
  activeView: ContentView;
  onNavigate: (view: ContentView) => void;
}

export const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [myStuffOpen, setMyStuffOpen] = useState(false);
  const [activeDropdownItem, setActiveDropdownItem] = useState("");

  const getViewFromLabel = (label: string): ContentView | null => {
    switch (label) {
      case "Home":
        return "home";
      case "Marketplace":
        return "marketplace";
      case "Community Feed":
        return "community";
      case "Messages":
        return "messages";
      case "AI Assistant":
        return "assistant";
      default:
        return null;
    }
  };

  const handleNavigation = (label: string) => {
    const view = getViewFromLabel(label);
    if (view) {
      onNavigate(view);
    }
  };

  const handleNonNavigationClick = (label: string) => {
    console.log(`${label} clicked`);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800">
        <div className="mb-8">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
          <span className="text-white font-semibold">OneTribe</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="py-2 px-3 flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.key}
            isNew={item.isNew}
            onClick={() => {
              const view = getViewFromLabel(item.label);
              if (view) {
                handleNavigation(item.label);
              } else {
                handleNonNavigationClick(item.label);
              }
            }}
          />
        ))}
      </div>

      <div className="flex-grow overflow-auto">
        <SidebarDropdownSection
          title="My stuff"
          isOpen={myStuffOpen}
          onToggle={() => setMyStuffOpen(!myStuffOpen)}
        >
          {myStuffItems.map((item) => (
            <DropdownItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeDropdownItem === item.label}
              onClick={() => setActiveDropdownItem(item.label)}
            />
          ))}
        </SidebarDropdownSection>

        <SidebarDropdownSection
          title="Resources"
          isOpen={resourcesOpen}
          onToggle={() => setResourcesOpen(!resourcesOpen)}
        >
          {resourcesItems.map((item) => (
            <DropdownItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isExternal={item.isExternal}
              isActive={activeDropdownItem === item.label}
              onClick={() => setActiveDropdownItem(item.label)}
            />
          ))}
        </SidebarDropdownSection>
      </div>
    </div>
  );
};
