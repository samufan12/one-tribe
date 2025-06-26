
import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DropdownItem } from "./DropdownItem";

type DropdownSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export const SidebarDropdownSection = ({ title, isOpen, onToggle, children }: DropdownSectionProps) => (
  <div className="py-2 px-3">
    <button 
      className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-accent"
      onClick={onToggle}
    >
      <div className="text-gray-300">
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      <span className="text-white text-sm font-medium flex-1 text-left">{title}</span>
    </button>
    
    {isOpen && (
      <div className="mt-1 space-y-1 animate-fade-in">
        {children}
      </div>
    )}
  </div>
);
