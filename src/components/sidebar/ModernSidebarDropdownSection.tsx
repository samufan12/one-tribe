import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DropdownItem } from "./DropdownItem";

type ModernDropdownSectionProps = {
  section: {
    title: string;
    items: Array<{
      title: string;
      icon: React.ComponentType<any>;
      id: string;
    }>;
  };
  activeView: string;
  onNavigate: (itemId: string) => void;
};

export const ModernSidebarDropdownSection = ({ section, activeView, onNavigate }: ModernDropdownSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2 px-3">
      <button 
        className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-gray-300">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        <span className="text-white text-sm font-medium flex-1 text-left">{section.title}</span>
      </button>
      
      {isOpen && (
        <div className="mt-1 space-y-1 animate-fade-in">
          {section.items.map((item) => (
            <DropdownItem
              key={item.id}
              icon={<item.icon size={16} />}
              label={item.title}
              isActive={activeView === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};